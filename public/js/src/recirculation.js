'use strict';

var $ = window.jQuery = require('jquery');
var each = require('lodash/collection/forEach');
var io = require('socket.io-browserify');
var d3 = require('d3');
var epoch = require('../../bower/epoch/epoch.min');

/*
* Viewer data representing live content
* aggregated from ChartBeat, updated every 5 seconds
*/
var first = true;
var gauge;

$(function() {
  var socket = io.connect();
  socket.emit('quickstats');
  socket.on('quickstats', function(data) {
    // Websocket used for constant streaming of data
    var time = Math.round((new Date()).getTime() / 1000);
    var recirc = 0;
    var article = 0;

    each(data, function(stats, host) {
      recirc += stats.recirc;
      article += stats.article;
    });

    var newRatio = article ? recirc / article : 0;

    if (!first) {
      gauge.push(newRatio);
      return;
    }

    gauge = $("#gauge").epoch({
      "type": "time.gauge",
      "value": newRatio
    });

    first = false;
  });

  return socket;

});
