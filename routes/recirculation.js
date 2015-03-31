var _ = require('lodash');

var express = require('express');
var router = express.Router();

var config = require('../config');
var constants = require('../helpers/constants');
var Beat = require('../helpers/beat');

router = router.get('/', function(req, res, next) {
  res.render('recirculation', { title: 'Recirculation'})
});

function success(app, responses) {
  var data = {
    recirculation: 0,
    article: 0
  };
  _.forEach(responses, function(response) {
    var resp = response[1];

    data.recirculation += resp.recirc;
    data.article += resp.article
  });

  app.io.room('recirculation').broadcast('chartbeat', {
    data: data
  });
}

module.exports = {
  router: router,
  beat: function(app) {
    return new Beat(app, 'recirculation', {
      apiString: constants.apiPaths['quickstats'],
      success: success
    })
  }
}

