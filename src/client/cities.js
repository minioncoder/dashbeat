import React from 'react';
import io from 'socket.io-client';

export default class CitiesDashboard extends React.Component {
  constructor(args) {
    super(args);

    this.maxFontSize = 150;

    this.state = {
      cities: this.props.cities || [],
      total: this.props.total || 1
    }
  }

  renderCity = (city, index) => {
    let percentage = (city.value / this.state.total);
    let largestPercentage = (this.state.cities[0].value / this.state.total);
    let fontSize = (percentage / largestPercentage ) * this.maxFontSize;
    let lineHeight = `${fontSize * 1.25}px`;
    let style = { fontSize, lineHeight };
    let valueStyle = {
      fontSize: `${fontSize * .5}px`,
    }

    return (
      <div className='city' key={ `city-${index}` } style={ style }>
        { city.name }
        <span className='value' style={ valueStyle }>{ `(${city.value})` }</span>
      </div>
    )
  }

  render() {
    return (
      <div className='city-list'>
        { this.state.cities.map(this.renderCity) }
      </div>
    )
  }
}

let dashboard = React.render(
  <CitiesDashboard/>,
  document.getElementById('cities')
);

let socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling']});
socket.emit('get_topgeo');
socket.on('got_topgeo', function(data) {
  let cities = {};
  let snapshot = data.snapshot;

  for (var host of snapshot.cities) {
    for (var city in host.cities) {
      let val = host.cities[city];
      if (city in cities) {
        cities[city] += val;
      } else {
        cities[city] = val;
      }
    }
  }

  let topCities = [];
  for (var city in cities) {
    topCities.push({
      name: city,
      value: cities[city]
    });
  }
  topCities = topCities.sort(function(a, b) { return b.value - a.value }).slice(0, 100);
  let total = 0;
  for (var city of topCities) {
    total += city.value;
  }

  dashboard.setState({ cities: topCities, total });
});
