import Router from 'express';
var router = Router();

router.get('/', function(req, res, next) {
  res.render('authors', { title: 'Popular Authors' });
});

module.exports = {
  router: router,
};
