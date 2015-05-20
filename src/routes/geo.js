export default function init(app) {
  app.get('/geo', function(req, res, next) {
    res.render('geo', { title: 'Where are they reading?' });
  });
}
