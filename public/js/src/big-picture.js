'use strict';

import base from './lib/base';
import io from 'socket.io-browserify';

socket = io.connect();

socket.emit('toppaages');
socket.on('toppages', function(data) {


});