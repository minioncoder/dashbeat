'use strict';

import io from 'socket.io-client';
import xr from 'xr';
import React from 'react';
import ReactDOM from 'react-dom';

import ArticleHandler from './big-picture/article-handler';

var socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] })

ReactDOM.render(
  <ArticleHandler articles={ [] }/>,
  document.getElementById('articles')
)

function fetchArticlesLoop() {
  xr.get('https://api.michigan.com/v1/news', { limit: 100 })
    .then(res => {

      let articles = [];
      for (let article of res.articles) {
        if (!article.photo || !article.photo.full) continue;
        articles.push(article);
      }

      ReactDOM.render(
        <ArticleHandler articles={ articles }/>,
        document.getElementById('articles')
      )
    });

  setTimeout(fetchArticlesLoop, 1000 * 60 * 10);
}


fetchArticlesLoop();
