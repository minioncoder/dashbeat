'use strict';

import express from 'express';
import debug from 'debug';
var logger = debug('app:routes');

import SupervisorApi from './supervisor';
import Config from '../config.js';

var router = express.Router();

router.get('/index', function(req, res, next) {
  let links = [];
  for (let dashboard of Config.dashboards) {
    let text = dashboard.split('-').join(' ');
    links.push({
      href: `/${dashboard}`,
      text
    });
  }

  links.sort(function(a, b) {
    return a.text.localeCompare(b.text);
  });

  res.render('index', { links });
});

// Dashboards
router.get('/', (req, res, next) => { res.render('popular'); });
router.get('/:dashboard/', (req, res, next) => {
  let dashboard = req.params.dashboard;

  if (Config.dashboards.indexOf(dashboard) < 0) {
    res.status(404).send('Dashboard not found');
    return;
  }

  res.render(dashboard);
});

// Xtra stuff
router.get('/xtra/lions/', (req, res, next) => {
  res.render('xtra', {
    team: 'lions',
    iosLink: 'http://j.mp/lionsios',
    androidLink: 'http://j.mp/lionsand'
  });
});
router.get('/xtra/wings/', (req, res, next) => {
  res.render('xtra', {
    team: 'red-wings',
    iosLink: 'http://j.mp/wings-ios',
    androidLink: 'http://j.mp/wings-and'
  });
});
router.get('/xtra/tigers/', (req, res, next) => {
  res.render('xtra', {
    team: 'tigers',
    iosLink: 'http://j.mp/tigersios',
    androidLink: 'http://j.mp/tigersand'
  })
});
router.get('/xtra/tigers/', (req, res, next) => {
  res.render('xtra', {
    team: 'wolverines',
    iosLink: 'http://j.mp/mich-ios',
    androidLink: 'http://j.mp/mich-and'
  })
})
router.get('/xtra/spartans/', (req, res, next) => {
  res.render('xtra', {
    team: 'spartans',
    iosLink: 'http://j.mp/msu-ios',
    androidLink: 'http://j.mp/msu-and'
  });
});

router.get('/xtra/pistons/', (req, res, next) => {
  res.render('xtra', {
    team: 'pistons',
    iosLink: 'http://j.mp/pistons-ios',
    androidLink: 'http://j.mp/pistons-and'
  });
});

router.get('/supervisor/info/', Catch(async (req, res, next) => {
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
