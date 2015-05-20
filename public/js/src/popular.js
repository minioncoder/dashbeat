$ = require('jquery');
var _ = require('lodash');
var io = require('socket.io-browserify');
var Article = require('./obj/article');
var sha1 = require('crypto').createHash('sha1');

var NUM_ARTICLES = 50;
var articles = {};

$(function() {
  function generateId(url) {
    /*  Given a URL of an article, generate a unique key for it */
    sha1.update(url);
    return sha1.digest('hex');
  }

  function compileArticles(data) {

    // It looks like the chartbeat API sends us back the articles in order
    var articles = [];
    for (var i = 0; i < NUM_ARTICLES; i++) {
      var nextArticle = undefined;
      var nextArticleSite = undefined;
      _.forEach(data.articles, function(hostArticles, site) {
          if (!hostArticles.length) return;

          if (typeof nextArticle === 'undefined') {
            nextArticle = hostArticles[0];
            nextArticleSite = site;
            return;
          }

          if (hostArticles[0].visits > nextArticle.visits) {
            nextArticle = hostArticles[0];
            nextArticleSite = site;
          }
      });

      if (typeof nextArticle === 'undefined') break;

      // Save this article and remove it from its list
      articles.push(nextArticle);
      data.articles[nextArticleSite] = _.drop(data.articles[nextArticleSite]);
    }

    return articles;
  }

  var socket = io.connect();
  socket.emit('toppages');
  socket.on('toppages', function(data) {
  	var articles = compileArticles(data);
    $('.articles').html('');

    _.forEach(articles, function(articleData) {
      var id = generateId(articleData.path);

      // If this article isn't currently drawn to the screen, draw it
      if (!$('#' + id).length) {
        $('.articles').append('<div class=\'article-container\' id=' + id + '></div>');
        var article = new Article(articleData, id);
        articles[id] = article;
      }
      else {
        article[id].setState({ readers: data.viewers });
      }
    });

  });
});

