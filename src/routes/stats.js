import Router from 'express';
var router = Router();

router.get('/', function(req, res, next) {
  res.render('stats', { title: 'Stats' });
});

module.exports = {
  router: router
}