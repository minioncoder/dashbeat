import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import assign from 'object-assign';

import { numberWithCommas } from './lib/parse';
import Config from '../../config';

class ViewersDashboard extends React.Component {
  static defaultProps = { series: [] }
  constructor(props) {
    super(props);

    this.state = assign({}, this.combineSeries(props.series), this.setWidth());
    this.yAxisStep = 5000;

    window.onresize = this.windowResize.bind(this);
  }

  componentDidMount() {
    this.setState(assign(this.state, this.combineSeries(this.props.series), this.setWidth()));
  }

  componentWillReceiveProps(props) {
    this.setState(assign(this.state, this.combineSeries(props.series), this.setWidth()));
  }

  windowResize() {
    this.setState(assign(this.state, this.combineSeries(this.props.series), this.setWidth()));
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

    let maxYAxis = Math.ceil(max / this.yAxisStep) * this.yAxisStep;

    return {
      series: totalSeries,
      max,
      maxYAxis
    };
  }

  setWidth = () => {
    let windowWidth = window.innerWidth;
    let width = windowWidth * .8;
    let height = width * .2;
    let graphWidthMultiplier = 0.8;

    if (windowWidth > 776 && windowWidth < 992 ) {
      height = width * .3;
    } else if (windowWidth < 776) {
      height = width * .4;
      graphWidthMultiplier = 0.95;
    }

    return {
      width,
      height ,
      graph: {
        width: width * graphWidthMultiplier,
        height: height * .8,
        startX: 0 + (width * .1),
        startY: height - (height * .1)
      },
      axis: {
      }
    };
  }

  renderScales = () => {
    let height = this.state.graph.height;
    let width = this.state.graph.width;
    let startX = this.state.graph.startX;
    let startY = this.state.graph.startY;
    let tickWidth = 20;

    // Y Axis
    let numYAxisMarks = this.state.maxYAxis / this.yAxisStep;
    let yPosStep = height / numYAxisMarks;
    let tickX = startX - (tickWidth / 2);

    let yAxisMarks = [];
    for (let i = 0; i <= numYAxisMarks; i++) {
      let y = height - (i * yPosStep);
      let textY = y;

      if (i === numYAxisMarks) {
        textY += 12;
        y += 1;
      }

      yAxisMarks.push(
        <g className='y-axis-mark' key={ `y-axis-${i}` }>
          <path className='tick' d={ `M ${tickX},${y} h ${tickWidth}` }></path>
          <text x={ 0 } y={ textY }>{ i * this.yAxisStep }</text>
        </g>
      )
    }

    // XAxis
    let numXAxisMarks = 24;
    let day = new Date(moment().format('YYYY MM DD'));
    let milliseconds = day.getTime();
    let xPosStep = width / numXAxisMarks;
    let tickY = height - (tickWidth / 2);

    let xAxisMarks = [];
    for (let i = 0; i < numXAxisMarks; i++) {
      let date = new Date(milliseconds);
      let x = (i * xPosStep) + startX;

      // Only display time ever 4 iterations
      let textEl = !(i % 4) ? <text x={ x } y={ this.state.height - 10 }>{ moment(date).format('h a') }</text>: null;
      xAxisMarks.push(
        <g className='x-axis-mark' key={ `x-axis-${milliseconds}` }>
          <path className='tick' d={ `M ${x},${tickY} v ${tickWidth}` }/>
          { textEl }
        </g>
      )

      milliseconds += 1000 * 60 * 60; // 1 hour
    }

    return (
      <g className='axis'>
        <g className='y-axis' >
          <path className='axis-bar' d={ `M ${startX},${height} v ${height * -1}` }/>
          { yAxisMarks }
        </g>
        <g className='x-axis'>
          <path className='axis-bar' d={ `M ${startX},${height} h ${width}` }/>
          { xAxisMarks }
        </g>
      </g>
    )
  }

  renderPath = () => {
    if (!this.state.series.length) return null;


    // Calculate the polygon so it takes up 90% of the width, and center it
    let height = this.state.graph.height;
    let width = this.state.graph.width;
    let startY = this.state.graph.startY;
    let startX = this.state.graph.startX;
    let polygonPoints = [`${startX} ${height}`];

    let series = this.state.series;
    let lastX = startX;
    let lastY = startY;
    let pointWidth = (width / this.state.series.length);
    for (let value of series) {
      let heightPct = value / this.state.max;
      let yVal = height - (heightPct * height * .95); // So the maximum is only ever 95% of the total graph height
      polygonPoints.push(`${lastX} ${yVal}`)

      lastX += pointWidth;
      lastY = yVal;
    }

    polygonPoints.push(`${lastY} ${height}`);
    polygonPoints.push(`${startX} ${height}`);

    return (
      <g className='graph-container'>
        <polygon className='graph' points={ `${polygonPoints.join(',')}` } id={ `polygon-${this.state.width}` }/>
      </g>
    )
  }

  render() {
    if (!this.state.width) return;

    return (
      <svg width={ this.state.width } height={ this.state.height }>
        { this.renderPath() }
        { this.renderScales() }
      </svg>
    )
  }
}

let socket = io(Config.socketUrl, { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_traffic_series');
socket.on('got_traffic_series', (data) => {
  ReactDOM.render(
    <ViewersDashboard series={ data.snapshot.sites } start={ data.snapshot.start }/>,
    document.getElementById('chart')
  )
  socket.off('got_traffic_series');
});

socket.emit('get_quickstats')
socket.on('got_quickstats', (data) => {
  let totalViewers = 0;
  for (let source of data.snapshot.stats) {
    totalViewers += source.visits;
  }
  document.getElementById('viewers').innerHTML = numberWithCommas(totalViewers);
});
