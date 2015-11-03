'use strict';

import express from 'express';
import debug from 'debug';
var logger = debug('app:routes');
import SupervisorApi from './supervisor';

var router = express.Router();

router.get('/', (req, res, next) => { res.render('popular'); });
router.get('/big-picture/', (req, res, next) => { res.render('big-picture'); });
router.get('/mobile/', (req, res, next) => { res.render('mobile'); });
router.get('/cities/', (req, res, next) => { res.render('cities'); });
router.get('/loyalty/', (req, res, next) => { res.render('loyalty'); });
router.get('/article-loyalty/', (req, res, next) => { res.render('article-loyalty'); });
router.get('/status/', (req, res, next) => { res.render('supervisor'); });
router.get('/author-percent/', (req, res, next) => { res.render('author-percent'); });
router.get('/authors/', (req, res, next) => { res.render('authors'); });
router.get('/geo-point/', (req, res, next) => { res.render('geo-point'); });
router.get('/stats/', (req, res, next) => { res.render('stats'); });
router.get('/test-socket/', (req, res, next) => { res.render('test-socket'); });
router.get('/info/', Catch(async (req, res, next) => {
  let user = process.env.SUPERVISOR_USER;
  let pass = process.env.SUPERVISOR_PASS;
  let client = new SupervisorApi('status.michigan.com', '80', user, pass);
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
