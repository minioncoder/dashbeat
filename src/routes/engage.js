function init(app) {
  app.get('/engage', function(req, res, next) {
    res.render('engage', { title: 'Site Engagement' })
  });
}

module.exports = {
  init: init
}