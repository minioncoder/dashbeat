import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import assign from 'object-assign';

class ViewersDashboard extends React.Component {
  static defaultProps = { series: [] }
  constructor(props) {
    super(props);

    this.state = assign({}, this.combineSeries(props.series), this.setWidth());

  }

  componentDidMount() {
    this.setWidth()
    this.setState(this.combineSeries(this.props.series));
  }

  componentWillReceiveProps(props) {
    this.setState(this.combineSeries(props.series))
  }

  /**
   * Combine site series into one series. Also return a max for the scale
   * https://api.michigan.com/v1/snapshot/traffic-series/
   *
   * @param {Array} series - Array of series from all the sites
   * @return {Object}
   * {
   *    series, // {Array} One array of combined series
   *    max, // {Number} maximum visits
   * }
   */
  combineSeries = (series) => {
    let totalSeries = [];
    let max = 0;
    for (let site of series) {
      for (let i = 0; i < site.visits.length; i++) {
        if (i == totalSeries.length) totalSeries.push(0);
        let visits = site.visits[i];
        totalSeries[i] += visits;

        if (totalSeries[i] > max) max = totalSeries[i];
      }
    }
    return {
      series: totalSeries,
      max
    };
  }

  setWidth = () => {
    let windowWidth = window.innerWidth;
    let width = windowWidth * .8;
    let height = width * .21;

    return { width, height };
  }

  renderScales = () => {

  }

  renderPath = () => {
    if (!this.state.series.length) return null;

    let series = this.state.series;
    let width = this.state.width / series.length;
    let height = this.state.height;
    let lastX = 0;
    let lastY = 0;
    let polygonPoints = [`0 ${height}`];

    for (let value of series) {
      let heightPct = value / this.state.max;
      let yVal = height - (heightPct * height);
      polygonPoints.push(`${lastX} ${yVal}`)

      lastX += width;
      lastY = yVal;
    }

    polygonPoints.push(`${lastY} ${height}`);
    polygonPoints.push(`0 ${height}`);

    return (
      <polygon fill={ 'red' } points={ `${polygonPoints.join(',')}` }/>
    )
  }

  render() {
    if (!this.state.width) return;

    return (
      <svg width={ this.state.width } height={ this.state.height }>
        { this.renderScales() }
        { this.renderPath() }
      </svg>
    )
  }
}

let socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_traffic_series');
socket.on('got_traffic_series', (data) => {

  ReactDOM.render(
    <ViewersDashboard series={ data.snapshot.sites }/>,
    document.getElementById('chart')
  )
});
