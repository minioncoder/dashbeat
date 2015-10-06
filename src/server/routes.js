'use strict';

import express from 'express';
import debug from 'debug';
var logger = debug('app:routes');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('popular');
});

router.get('/big-picture/', function(req, res, next) {
  res.render('big-picture');
});

module.exports = router;
