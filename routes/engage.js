var _ = require('lodash');
var url = require('url');
var util = require('util');

var express = require('express');
var router = express.Router();

var Beat = require('../helpers/beat');
var constants = require('../helpers/constants');
var parse = require('../helpers/parse');

router.get('/', function(req, res, next) {
  res.render('engage', {title: 'Site Engagement'});
});

function success(app, responses) {
  var data = {};
  _.forEach(responses, function(response) {
    // console.log(util.inspect(response[0].req));
    var host = parse.getHostFromResponse(response);

    data[host] = response[1].engaged_time;
  });

  app.io.room('engage').broadcast('chartbeat', {
    engage: data
  });
}

module.exports = {
  router: router,
  beat: function(app) {
    var beat = new Beat(app, 'engage', {
      apiString: constants.apiPaths['quickstats'],
      success: success
    });
  }
}