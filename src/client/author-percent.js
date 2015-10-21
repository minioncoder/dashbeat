'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

let socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_toppages');
socket.on('got_toppages', function(data) {
  console.log('got_toppages');
});

socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  console.log('got_quickstats');
});
