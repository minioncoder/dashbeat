$ = require('jquery');
var Handlebars = require('handlebars');

module.exports = function(data) {
  var article_template = Handlebars.compile($('#article-template').html());
  var html = article_template(data);

  var draw = function() {
    $('.articles').append(html);
  }

  return {
    draw: draw
  }
}