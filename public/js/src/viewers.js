/*
* Viewer data representing live content
* aggregated from ChartBeat, updated every 5 seconds
*/
'use strict';

var $ = window.jQuery = require('jquery');
var io = require('socket.io-browserify');
var each = require('lodash/collection/forEach');
var c3 = require('c3');
require('../../bower/jquery-animateNumber/jquery.animateNumber.min');

$(function() {
  var commaSeparatorNumberStep = $.animateNumber.numberStepFactories.separator(',');
  var ydayData = [];
  var chart = null;
  var first = true;

  connectSocket();

  function getTime(start, frequency, length) {
    var arr = ["x"];
    var cur_time = start;
    for (var i = 0; i < length; i++) {
      arr.push(cur_time * 1000);
      cur_time += frequency;
    }
    return arr;
  }

  function format_time(x) {
    var a = new Date(x * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    //var sec = a.getSeconds();
    var ampm = "AM";
    if (hour >= 12) {
      hour = hour - 12;
      ampm = "PM";
    }
    if (hour == 0) {
      hour = 12;
    }
    min = min < 10 ? "0" + min : min;
    //sec = sec < 10 ? "0"+sec : sec;
    return hour + ":" + min + " " + ampm;
  }

  function compileTotalViews(data) {
    console.log('COMPILING VIEWS');
    var viewersToday = [];
    var minLength;

    // It's not guaranteed that each site will have the same number
    // of values in their array. This makes the graph look kinda bad

    each(data.viewersToday, function(viewers) {

      var count = 0;
      each(viewers.people, function(numViewers, index) {
        if (numViewers === null) return false;
        count += 1;

        if (viewersToday.length <= index) {
          viewersToday.push(numViewers)
        }
        else {
          viewersToday[index] += numViewers;
        }
      });

      if (typeof minLength === 'undefined') {
        minLength = count;
      }
      else if (minLength > count) {
        minLength = count;
      }
    });

    return viewersToday.slice(0, minLength);
  }

  function connectSocket() {
    var socket = io.connect();

    // For the total number of readers
    socket.emit('quickstats')
    socket.on('quickstats', function(data) {

      var totalViews = 0;
      each(data, function(stats) {
        totalViews += stats.visits;
      });

      var prevViews = parseFloat($("#viewers").text().replace(/,/g, ""));

      $("#viewers")
      .prop("number", parseFloat($("#viewers").text().replace(/,/g, "")))
      .animateNumber({
        "number": totalViews,
        "numberStep": commaSeparatorNumberStep
      });

      var class_up = "fa-sort-asc";
      var class_down = "fa-sort-desc";

      $("#delta")
        .removeClass(class_up)
        .removeClass(class_down)
        .css("color", "#000");

      if (totalViews > prevViews) {
        $("#delta").addClass(class_up).css("color", "#76b729");
      } else if (totalViews < prevViews) {
        $("#delta").addClass(class_down).css("color", "#f04e55");
      }
    });

    // For historical traffic for today
    socket.emit('historicalTrafficSeries');
    socket.on('historicalTrafficSeries', function(data) {
      // TODO be more elegant about this. Need to get yesterdays data
      // first
      if (!ydayData.length) return;


      // Compile all viewersToday from each host into one
      var viewersToday = compileTotalViews(data);

      var time = getTime(data.start, data.frequency * 60, ydayData.length);
      viewersToday.unshift("Today");
      if (first) {
        ydayData.unshift("Yesterday");
        chart = c3.generate({
          "bindto": '#line_chart',
          "data": {
            "x": "x",
            "columns": [
              time,
              viewersToday,
              ydayData
            ],
            "colors": {
              "Today": "#ffee83",
              "Yesterday": "#f04e55"
            },
            "types": {
              "Today": "area-spline",
              "Yesterday": "area-spline"
            }
          },
          "axis": {
            "x": {
              "type": "timeseries",
              "tick": {
                "count": 24,
                "format": "%H:%M"
              }
            }
          },
          "tooltip": {
            "show": false
          },
          "point": {
            "show": false
          }
        });
        first = false;
      } else {
        chart.load({
          "columns": [viewersToday]
        });
      }
    });

    // For yesterdays data
    socket.emit('yesterdayData');
    socket.on('yesterdayData', function(data) {
      ydayData = compileTotalViews(data);
    });
  }

});