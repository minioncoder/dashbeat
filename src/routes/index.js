'use strict';

import express from 'express';
import request from 'request';
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
  if (!('url' in req.params) || !req.params.url) {
    res.json({});
  }
  var articleUrl = req.params.url;
  console.log(articleUrl);
  request({
    uri: articleUrl,
    json: true
  }, function(error, response, body) {
    if (error) throw Error(error);

    res.json(body);
  });

  next();
});

module.exports = router;