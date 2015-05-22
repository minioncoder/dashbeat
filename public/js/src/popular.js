'use strict';

import { each, keys, drop }  from 'lodash';
import io from 'socket.io-browserify';
import crypto from 'crypto';
import Article from './jsx/article.jsx';
import AnimateNumber from './jsx/animate-number.jsx';

var currentArticles = {};
var totalReaders = AnimateNumber(0, 'total-readers');
var articlesContainer = document.getElementsByClassName('articles')[0];
var socket = io.connect();

socket.emit('toppages');
socket.on('toppages', function(data) {
  var removeArticles = {};
  for (let key in currentArticles) {
    removeArticles[key] = true;
  }

  data.sort(function(a, b) {
    return parseInt(b.visits) - parseInt(a.visits);
  });

  for (let i = 0; i < 50; i++) {
    let articleData = data[i];
    articleData.rank = i;
    var id = generateId(articleData.path);

    if (id in currentArticles) {
      currentArticles[id].setProps({
        readers: articleData.visits,
        rank: articleData.rank
      });
      delete removeArticles[id];
      continue;
    }

    var div = document.createElement('div');
    div.id = id;
    div.className += 'article-container container-fluid';
    articlesContainer.appendChild(div);

    currentArticles[id] = new Article(articleData, id);
  }

  each(removeArticles, function(val, id) {
    document.getElementById(id).remove();
    delete currentArticles[id];
  });
});

socket.emit('quickstats');
socket.on('quickstats', function(data) {
  let value = 0;
  each(data, function(stats, host) {
    value += stats.visits;
  });

  if (isNaN(value)) return;

  totalReaders.setProps({ value: value });
});

function generateId(url) {
  /*  Given a URL of an article, generate a unique key for it */
  let sha1 = crypto.createHash('sha1');
  sha1.update(url);
  return sha1.digest('hex');
}
