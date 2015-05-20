$ = jQuery = require('jquery');
var _ = require('lodash');
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
    _.forEach(data, function(stats, host) {
      recirc += stats.recirc;
      article += stats.article;
    });

    var newRatio = article ? recirc / article : 0;

    if (first) {
      gauge = $("#gauge").epoch({
        "type": "time.gauge",
        "value": newRatio
      });
      first = false;
    } else {
      gauge.push(newRatio);
    }
  });

  return socket;

});
