'use strict';

import Framework from './framework/index';
import io from 'socket.io-browserify';

socket = io.connect();

socket.emit('toppaages');
socket.on('toppages', function(data) {


});