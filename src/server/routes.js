'use strict';

import express from 'express';
import request from 'request';
import debug from 'debug';
var logger = debug('app:routes');

import SupervisordApi from './lib/api';
import getAsync from './lib/promise';
import Report from './heartbeat/reports';

var router = express.Router();
let report = new Report(undefined, 'reports');

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

  report.fetch(res, date);
});

router.get('/supervisord', function(req, res, next) {
  let client = new SupervisordApi('localhost', '9001');
  client.getAllProcessInfo(function(err, procs) {
    if (err) return next(err);

    logger(procs);
    res.render('supervisord', {procs});
  });
});

module.exports = router;
