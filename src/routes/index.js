'use strict';

import express from 'express';
import request from 'request';

import logger from  '../logger';
import getAsync from '../lib/promise';

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

router.get('/get-article/', async function(req, res, next) {
  logger.debug(req.query);

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

  res.json(response.body);
});

module.exports = router;