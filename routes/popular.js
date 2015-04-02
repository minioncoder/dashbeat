var _ = require('lodash');
var moment = require('moment');

var express = require('express');
var router = express.Router();

var config = require('../config');
var parse = require('../helpers/parse');
var constants = require('../helpers/constants');
var Beat = require('../helpers/beat');

router.get('/', function(req, res, next) {
  res.render('popular', { title: 'Popular Articles' });
});

function success(app, responses) {
  var articles = [];
  // parse chartbeat response data
  _.forEach(responses, function(response) {
    _.forEach(response[1].pages, function(article) {
      if (parse.isSectionPage(article.path)) return;

      articles.push({
        path: article.path,
        title: article.title,
        visits: article.stats.visits
      });
    });
  });

  articles = _.sortByOrder(articles, ['visits'], [false]);
  return {
    articles: articles.splice(0, 40)
  }
}

module.exports = {
  router: router,
  beat: function(app) {
    return new Beat(app, 'popular', {
      apiString: constants.apiPaths['toppages'],
      success: success
    });
  }
};
