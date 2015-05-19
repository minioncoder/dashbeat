import Router from 'express';
var router = Router();

router.get('/', function(req, res, next) {
  res.render('engage', {title: 'Site Engagement'});
});

module.exports = {
  router: router
}