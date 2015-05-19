import Router from 'express';
var router = Router();

router = router.get('/', function(req, res, next) {
  res.render('recirculation', { title: 'Recirculation'})
});

module.exports = {
  router: router,
}

