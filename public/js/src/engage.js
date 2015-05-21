'use strict';

var $ = window.jQuery = require('jquery');
var io = require('socket.io-browserify');
var shuffle = require('./lib/shufflejsLocal');
require('../../bower/jquery-animateNumber/jquery.animateNumber.min');

$(function() {

  $("#engage_data").shuffle({
      "itemSelector": ".shuff",
      "sizer": $("#engage_data").find(".shuffle__sizer")
  });

  function connect_socket() {
    // Websocket used for constant streaming of data
    var socket = io.connect();
    socket.emit('quickstats');
    // Server sent a message to the client, update geo map
    socket.on('quickstats', function(data) {

      for (site in data) {
        var found = false;
        $("#engage_data > .shuff > div").each(function() {
          if ($(this).data("host") == site) {
            found = true;
            var val_el = $(this).find(".eng_avg");
            var prev_avg = val_el.text();
            val_el
              .prop("number", parseFloat(prev_avg))
              .animateNumber({
                  "number": data[site].engaged_time.avg
              });
          }
        });
        if (!found) {
          var content = '<div class="row shuff">' +
                          '<div class="col-md-12" data-host="' + site + '" data-groups="[\'engage\']">' +
                          '   <strong>' + site + '</strong>: <span class="eng_avg">0</span>' +
                          '</div>' +
                        '</div>';
          $("#engage_data").append(content);
          $(".eng_avg").last().animateNumber({ "number": data[site].engaged_time.avg });
          $("#engage_data").shuffle("appended", $(".shuff").last());
        }
      }

      $("#engage_data").shuffle("sort", {
        "reverse": true,
        "by": function($el) {
            return parseInt($el.find(".eng_avg").text());
        }
      });
    });

    return socket;
  };

  var socket = connect_socket();
});