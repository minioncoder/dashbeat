'use strict';

var $ = require('jquery');
var each = require('lodash/collection/forEach');
var io = require('socket.io-browserify');
var c3 = require('c3');

$(function() {
  // var tableSource = $("#stats-table-template").html();
  // var tableRowSource = $("#stats-row-template").html();
  // var tableTemplate = Handlebars.compile(tableSource);
  // var tableRowTemplate = Handlebars.compile(tableRowSource);
  var socket = io.connect();

  // Set up WebSocket
  var numUpdates = 0;

  // jQuery selectors
  var $pieChart = "#stat-pie-chart";
  var $chartInfo = ".chart-info";

  // Color pallate for the pie chart
  var colorPalette = [
    "#76b729",
    "#3d97df",
    "#cac392",
    "#513629"
  ];

  var chart;


  function getChartHeight() {
    return parseInt($(window).height() * .9);
  }

  function getChartWidth() {
    return parseInt($(window).width() * .6);
  }

  function parseStats(data) {
    var statNames = ["social", "links", "search", "direct" ]
    var stats = {};
    each(statNames, function(stat) {
      stats[stat] = {
        total: 0
      }
    });

    each(data, function(hostStats, host) {

      each(stats, function(stat, key) {
        if (key in hostStats) {
          stat.total += hostStats[key];
          stat[host] = hostStats[key];
        }

      });
    });

    return stats;
  }

  socket.emit('quickstats');
  // Message handler
  socket.on('quickstats', function(data) {
    var data = parseStats(data);

    if (data) {
      // Get the stats from the data string
      var statValues = data;
      // Fade out loading screen
      $(".loading").addClass("loading-done");


      // IE < 10 doesn't support transitionend :(
      setTimeout(function(){
        $(".loading").hide();
        drawStatChart(statValues);
      },500);

      // Populate the table
      // populateTable(statValues);
      // Draw the chart
    }

    numUpdates += 1;
  });

  // Draw the pie chart
  function drawStatChart(statValues) {
    // Compile data for c3 pie chart
    // http://c3js.org/samples/chart_pie.html
    var columns = [];
    var colors = {};
    var colorIndex = 0;
    for (var stat in statValues) {
      // Add the stat
      columns.push([
        stat,
        statValues[stat].total
      ]);

      // Add the color
      colors[stat] = (colorIndex < colorPalette.length) ? colorPalette[colorIndex] : '#' + Math.floor(Math.random() * 16777215).toString(16);
      colorIndex++;
    }

    columns.sort(function(a, b) {
      if (a[1] > b[1]) {
        return -1; // 'a' comes first
      }

      if (a[1] < b[1]) {
        return 1; // 'b' comes first
      }

      return 0;
    });

    if (!chart) {
      // Create the chart if it doesn't yet exist
      chart = c3.generate({
        "data": {
          "columns": columns,
          "type": "pie",
          "size": {
            "width": getChartWidth(),
            "height": getChartHeight(),
          },
          "colors": colors,
        },
        "tooltip": {
          "format": {
            "value": function (value, ratio, id) {
              var format = d3.format(',');
              return format(value);
            }
          }
        },
        "onresized": function() {
          var size = {
            "height": getChartHeight(),
            "width": getChartWidth()
          }
          chart.resize(size);
        }
      });
    } else {
      // If the chart already exists, load up the new data
      chart.load({ "columns": columns });
    }
  }
});