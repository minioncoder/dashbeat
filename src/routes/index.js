'use strict';

import express from 'express';
import request from 'request';
import logger from  '../logger';
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('popular');
});

router.get('/authors/', function(req, res, next) {
  res.render('authors');
});

router.get('/big-picture/', function(req, res, next) {
  res.render('big-picture');
});

router.get('/get-article/', function(req, res, next) {
  logger.debug(req.query);
  if (!('url' in req.query) || !req.query.url) {
    res.json({});
    return;
  }
  var articleUrl = req.query.url;
  request({
    url: articleUrl,
    json: true
  }, function(error, response, body) {
    if (error) throw new Error(error);

    // TODO save this thing
    res.json(body);
  });
});

module.exports = router;