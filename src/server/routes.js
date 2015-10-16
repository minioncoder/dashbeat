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
});

router.get('/cities/', (req, res, next) => {
  res.render('cities');
});

router.get('/loyalty/', (req, res, next) => {
  res.render('loyalty');
});

module.exports = router;
