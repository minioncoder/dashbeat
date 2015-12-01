'use strict';

import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';

import CitiesDashboard from './cities/cities-dashboard';
import Config from '../../config';

ReactDOM.render(
  <CitiesDashboard/>,
  document.getElementById('cities')
);

let socket = io(Config.socketUrl, { transports: ['websocket', 'xhr-polling']});

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

  ReactDOM.render(
    <CitiesDashboard cities={ topCities }/>,
    document.getElementById('cities')
  );
});
