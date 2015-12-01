'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import { updateQuickstats, updateToppages } from './author-percent/store';
import Dashboard from './author-percent/author-percent-dashboard';
import Config from '../../config';

let dashboard = ReactDOM.render(
  <Dashboard/>,
  document.getElementById('author-percent')
);

let socket = io(Config.socketUrl, { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_popular');
socket.on('got_popular', function(data) {
  updateToppages(data.snapshot);
});

socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  updateQuickstats(data.snapshot);
});
