var _ = require('lodash');

var express = require('express');
var router = express.Router();

var constants = require('../helpers/constants');
var Beat = require('../helpers/beat');
var parse = require('../helpers/parse');

router.get('/', function(req, res, next) {
  res.render('stats', { title: 'Stats' });
});

var Stats = function() {
  var statNames = ["social", "links", "search", "direct" ]
  var stats = {}

  _.forEach(statNames, function(stat) {
    stats[stat] = {
      total: 0
    } 
  });

  var addStats = function(host, response) {
    _.forEach(stats, function(stat, key) {
      if (key in response) {
        stat.total += response[key];
        stat[host] = response[key];
      }

    });
  }

  var getStats = function() {
    return stats;
  }

  return {
    addStats: addStats,
    getStats: getStats
  }
}

function success(app, responses) {
  var stats = new Stats();
  _.forEach(responses, function(response) {
    var host = parse.getHostFromResponse(response);
    var resp = response[1];

    stats.addStats(host, resp);
  });

  return {
    stats: stats.getStats()
  }
}

module.exports = {
  router: router,
  beat: function(app) {
    return new Beat(app, 'stats', {
      apiString: constants.apiPaths['quickstats'],
      success: success
    });
  }
}