'use strict';

import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';

import ArticleHandler from './big-picture/article-handler';

var socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] })
//var articleHandler = new ArticleHandler();
//var articleContainer = document.getElementsByClassName('articles')[0];

ReactDOM.render(
  <ArticleHandler />,
  document.getElementById('articles')
)
