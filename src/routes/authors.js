
function init(app) {
  app.get('/authors', function(req, res, next) {
    res.render('authors', { title: 'Popular Authors' });
  });
}

module.exports = {
  init: init
};
