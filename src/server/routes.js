'use strict';

import express from 'express';
import debug from 'debug';
var logger = debug('app:routes');

import SupervisorApi from './supervisor';

var router = express.Router();

router.get('/index', function(req, res, next) {
  let links = [];
  for (let i = 0; i < router.stack.length; i++) {
    let route = router.stack[i];

    let href = route.route.path;
    if (href == '/') continue;
    if (href == '/index') continue;

    let text = href
      .replace(/\-/g, ' ')
      .replace(/\//g, '')
      .toUpperCase();

    links.push({ href, text });
  }

  links.push({
    href: '/authors?detroit=1',
    text: 'AUTHORS WITH DETROIT'
  });

  links.sort(function(a, b) {
    return a.text.localeCompare(b.text);
  });

  res.render('index', { links });
});

// Dashboards
router.get('/', (req, res, next) => { res.render('popular'); });
router.get('/popular', (req, res, next) => { res.render('popular'); });
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
router.get('/recirculation/', (req, res, next) => { res.render('recirculation'); });
router.get('/viewers/', (req, res, next) => { res.render('viewers'); });
router.get('/test-socket/', (req, res, next) => { res.render('test-socket'); });

// Xtra stuff
router.get('/lions-xtra/', (req, res, next) => {
  res.render('xtra', {
    team: 'lions',
    iosLink: 'http://j.mp/lionsios',
    androidLink: 'http://j.mp/lionsand'
  });
});
router.get('/wings-xtra/', (req, res, next) => {
  res.render('xtra', {
    team: 'red-wings',
    iosLink: 'http://j.mp/wings-ios',
    androidLink: 'http://j.mp/wings-and'
  });
});
router.get('/tigers-xtra/', (req, res, next) => {
  res.render('xtra', {
    team: 'tigers',
    iosLink: 'http://j.mp/tigersios',
    androidLink: 'http://j.mp/tigersand'
  })
});
router.get('/wolverines-xtra/', (req, res, next) => {
  res.render('xtra', {
    team: 'wolverines',
    iosLink: 'http://j.mp/mich-ios',
    androidLink: 'http://j.mp/mich-and'
  })
})
router.get('/spartans-xtra/', (req, res, next) => {
  res.render('xtra', {
    team: 'spartans',
    iosLink: 'http://j.mp/msu-ios',
    androidLink: 'http://j.mp/msu-and'
  });
});

router.get('/pistons-xtra/', (req, res, next) => {
  res.render('xtra', {
    team: 'pistons',
    iosLink: 'http://j.mp/pistons-ios',
    androidLink: 'http://j.mp/pistons-and'
  });
})

router.get('/info/', Catch(async (req, res, next) => {
  let user = process.env.SUPERVISOR_USER;
  let pass = process.env.SUPERVISOR_PASS;

  let client = new SupervisorApi('status.michigan.com', '80', user, pass);
  let procs = await client.info();

  let mapi = new SupervisorApi('api.michigan.com', '1337', user, pass);
  let mapi_proc = await mapi.info();
  if (mapi_proc.length > 0) procs.push(mapi_proc[0]);

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
