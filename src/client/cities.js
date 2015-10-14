import React from 'react';
import io from 'socket.io-client';

import City from './jsx/city';

export default class CitiesDashboard extends React.Component {
  constructor(args) {
    super(args);

    this.maxFontSize = 175;

    this.state = {
      cities: this.props.cities || [],
      total: 0,
      max: 0
    }

    this.max = 1000;
  }

  componentWillReceiveProps(nextProps) {
    let total = 0;
    let max = 0;
    for (let city of nextProps.cities) {
      total += city.total;
      if (city.total > max) max = city.total;
    }

    this.setState({
      cities: nextProps.cities,
      total,
      max
    })
  }

  renderCity = (city, index) => {
    let cityKey = city.name.replace(/ /g, '-');
    let width = (city.total / this.max) * 95;
    return <City index={ index }
              name={ city.name }
              total={ city.total }
              hostData={ city.hostData }
              width={ width }
              key={ cityKey }/>
  }

  render() {
    return (
      <div className='city-list'>
        { this.state.cities.slice(0, 40).map(this.renderCity) }
      </div>
    )
  }
}

React.render(
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
        cities[city].total += val;
      } else {
        cities[city] = { total: val, hostData: {}};
      }

      cities[city]['hostData'][host.source] = val;
    }
  }

  let topCities = [];
  for (var city in cities) {
    topCities.push({
      name: city,
      total: cities[city].total,
      hostData: cities[city].hostData
    });
  }

  topCities = topCities.sort(function(a, b) { return b.total - a.total }).slice(0, 100);

  React.render(
    <CitiesDashboard cities={ topCities }/>,
    document.getElementById('cities')
  );
});
