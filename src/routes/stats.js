
function init(app) {
  app.get('/stats', function(req, res, next) {
    res.render('stats', { title: 'Stats' });
  });
}

module.exports = {
  init: init
}