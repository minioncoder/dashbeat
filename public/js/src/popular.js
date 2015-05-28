'use strict';

import _each from 'lodash/collection/forEach';
import io from 'socket.io-browserify';
import crypto from 'crypto';

import DashSocket from './lib/socket';
import Article from './jsx/article.jsx';
import AnimateNumber from './jsx/animate-number.jsx';

const MAX_ARTICLES = 50;
var currentArticles = {};
var totalReaders = AnimateNumber(0, 'total-readers');
var articlesContainer = document.getElementsByClassName('articles')[0];
var socket = io.connect();

// emit toppages event which will be directed to toppages route
// and join toppages room
//socket.emit('toppages');
var dash = new DashSocket(socket, 'toppages');
dash.on('data', function(data) {
  console.log(data);
  socket.disconnect();
});
// listing on data event
/*socket.on('data', function(data) {
  let removeArticles = {};
  for (let key in currentArticles) {
    removeArticles[key] = true;
  }

  data.sort(function(a, b) {
    return parseInt(b.visits) - parseInt(a.visits);
  });

  let dlength = MAX_ARTICLES;
  if (data.length < MAX_ARTICLES) dlength = data.length;

  for (let i = 0; i < dlength; i++) {
    let articleData = data[i];
    articleData.rank = i;
    let id = generateId(articleData.path);

    if (id in currentArticles) {
      currentArticles[id].setProps({
        readers: articleData.visits,
        rank: articleData.rank
      });
      delete removeArticles[id];
      continue;
    }

    let div = document.createElement('div');
    div.id = id;
    div.className += 'article-container container-fluid';
    articlesContainer.appendChild(div);

    currentArticles[id] = new Article(articleData, id);
  }

  _each(removeArticles, function(val, id) {
    document.getElementById(id).remove();
    delete currentArticles[id];
  });
});*/
/*
socket.emit('quickstats');
socket.on('data', function(data) {
  let value = 0;
  _each(data, function(stats, host) {
    value += stats.visits;
  });

  if (isNaN(value)) return;

  totalReaders.setProps({ value: value });
});

function generateId(url) {
  // Given a URL of an article, generate a unique key for it
  let sha1 = crypto.createHash('sha1');
  sha1.update(url);
  return sha1.digest('hex');
}*/
