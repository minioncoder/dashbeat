
function init(app) {
  app.get('/recirculation', function(req, res, next) {
    res.render('recirculation', { title: 'Recirculation' });
  });
}

module.exports = {
  init: init
}

