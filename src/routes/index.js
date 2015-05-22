'use strict';

import express from 'express';
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

module.exports = router;