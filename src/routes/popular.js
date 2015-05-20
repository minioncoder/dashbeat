export default function init(app) {
  app.get('/', function(req, res, next) {
    res.render('popular', { title: 'Popular Articles' });
  });
}
