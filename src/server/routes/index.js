'use strict';

import express from 'express';
import request from 'request';
import debug from 'debug';
var logger = debug('app:routes');

import getAsync from '../lib/promise';
import Report from '../heartbeat/reports';

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

router.get('/referrers/', function(req, res, next) {
  res.render('referrers');
});

router.get('/daily-perspective/', function(req, res, next) {
  res.render('daily-perspective');
});

router.get('/get-article/', async function(req, res, next) {
  if (!('url' in req.query) || !req.query.url) {
    res.json({});
    return;
  }

  let url = req.query.url;
  let response;
  try {
    response = await getAsync(url, { json: true });
  } catch (err) {
    throw new Error(err);
  }

  logger('Returned from ' + url);

  res.json(response.body);
});

router.get('/get-daily-perspective/', function(req, res, next) {
  let date;
  if ('date' in req.query) {
    date = req.query.date;
  }

  let report = new Report(undefined, 'reports', res, date);
  report.fetch();
});

module.exports = router;
