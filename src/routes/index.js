'use strict';

import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('popular', { title: 'Popular Articles' });
});

router.get('/authors', function(req, res, next) {
  res.render('authors', { title: 'Popular Authors' });
});

module.exports = router;