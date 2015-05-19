var $ = jQuery = require('jquery-browserify');
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

  socket.emit('recirculation');

  socket.on('chartbeat', function(data) {
    // Websocket used for constant streaming of data

    var response = data.data;
    var time = Math.round((new Date()).getTime() / 1000);

    if (response.hasOwnProperty("recirculation")) {
      var recirc = response.recirculation;
      var article = response.article;
      var newRatio = recirc / article;

      if (first) {
        gauge = $("#gauge").epoch({
          "type": "time.gauge",
          "value": newRatio
        });
        first = false;
      } else {
        gauge.push(newRatio);
      }
    }
  });

  return socket;

});
