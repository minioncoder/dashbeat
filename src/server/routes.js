'use strict';

import express from 'express';
import debug from 'debug';
var logger = debug('app:routes');

var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('popular');
});

router.get('/big-picture/', (req, res, next) => {
  res.render('big-picture');
});

router.get('/mobile/', (req, res, next) => {
  res.render('mobile');
})

module.exports = router;
