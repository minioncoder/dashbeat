'use strict';

import express from 'express';
import debug from 'debug';
var logger = debug('app:routes');
import SupervisorApi from './supervisor';

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

router.get('/status/', function(req, res, next) {
  res.render('supervisor');
});

router.get('/info/', Catch(async function(req, res, next) {
  let client = new SupervisorApi('status.michigan.com', '80', 'ebower', '1337sk33t');
  let procs = await client.info();
  res.json({ procs });
}));

/**
 * Use this to wrap a route that uses async/await.
 * It helps catch any rejected promises.
 */
function Catch(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next)
  };
}

module.exports = router;
