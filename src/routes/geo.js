import Router from 'express';
var router = Router();

router.get('/', function(req, res, next) {
  res.render('geo', { title: 'Popular Articles' });
});

module.exports = {
  router: router,
};
