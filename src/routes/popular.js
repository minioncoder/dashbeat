import Router from 'express';
var router = Router();

router.get('/', function(req, res, next) {
  res.render('popular', { title: 'Popular Articles' });
});

module.exports = {
  router: router,
};
