'use strict';

import $  from 'jquery';
import { each, keys, drop }  from 'lodash';
import io from 'socket.io-browserify';
import crypto from 'crypto';

// React objects
var Article = require('./lib/article');
var AnimateNumber = require('./lib/animate-number');

var NUM_ARTICLES = 50;
var currentArticles = {};

var hosts = {};
var totalReaders = AnimateNumber(0, 'total-readers');

$(function() {
  function generateId(url) {
    /*  Given a URL of an article, generate a unique key for it */
    var sha1 = crypto.createHash('sha1');
    sha1.update(url);
    return sha1.digest('hex');
  }

  function compileArticles(data) {

    // It looks like the chartbeat API sends us back the articles in order
    var articles = [];
    for (var i = 0; i < NUM_ARTICLES; i++) {
      var nextArticle = undefined;
      var nextArticleSite = undefined;
      each(data.articles, function(hostArticles, site) {
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
      nextArticle.rank = articles.length;
      articles.push(nextArticle);
      data.articles[nextArticleSite] = drop(data.articles[nextArticleSite]);
    }

    return articles;
  }

  var socket = io.connect();
  socket.emit('toppages');
  socket.on('toppages', function(data) {
  	var articles = compileArticles(data);
    var articleKeys = keys(currentArticles);
    var keyObj = {};
    each(articleKeys, function(key) { keyObj[key] = true; });

    each(articles, function(articleData) {
      var id = generateId(articleData.path);

      // If this article isn't currently drawn to the screen, draw it
      if (!(id in currentArticles)) {
        $('.articles').append('<div class=\'article-container row\' id=' + id + '></div>');
        var article = new Article(articleData, id);
        article.moveArticle();
        currentArticles[id] = article;
      }
      else {
        currentArticles[id].updateArticle({
          readers: articleData.visits,
          rank: articleData.rank
        });
        delete keyObj[id];
      }
    });

    each(keyObj, function(val, id){
      $('#' + id).remove();
      delete currentArticles[id];
    });
  });

  socket.emit('quickstats');
  socket.on('quickstats', function(data) {
    var value = 0;
    each(data, function(stats, host) {
      hosts[host] = true;
      value += stats.visits;
    });

    totalReaders.setProps({ value: value });
  });
});

