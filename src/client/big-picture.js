'use strict';

import keys from 'lodash/object/keys';
import Chance from 'chance';
import io from 'socket.io-client';
import React from 'react';
import xr from 'xr';

import Framework from './framework/index';
import { addSlash } from './lib/parse';

import Article from './jsx/big-picture.jsx';

class ArticleHandler extends React.Component {
  constructor(args) {
    super(args);

    this.numDisplayed = 4;

    this.state = {
      articles: [],
      activeArticles: [],
      nextDisplay: 0,
    }
  }

  componentDidMount() {
    this.fetchArticles();
  }

  fetchArticles() {
    xr.get('https://api.michigan.com/v1/news', { limit: 100 })
      .then(res => {
        this.setState({
          articles: res.articles
        });
      });
  }

  getRandomArticleIndex = () => {
    let randomIndex = 0;
    for (let count = 0; count < this.state.articles.length; count++) {
      let rand = Math.floor(Math.random() * this.state.articles.length);
      if (this.state.activeArticles.indexOf(rand) < 0) {
        let article = this.state.articles[rand];
        if ('photo' in article && 'full' in article.photo && article.photo.full.url) {
          randomIndex = rand;
          break;
        }
      }
    }
    return randomIndex;
  }

  renderArticles = () => {
    function renderArticle(articleIndex, index) {
      let article = this.state.articles[articleIndex];
      return (
        <Article imageUrl={ article.photo.full.url } headline={ article.headline } />
      )
    }
    while (this.state.activeArticles.length < 4) this.state.activeArticles.push(this.getRandomArticleIndex())

    return (
      <div className='articles'>
        { this.state.activeArticles.map(renderArticle.bind(this)) }
      </div>
    )

  }

  render() {
    if (!this.state.articles.length) {
      return (
        <div className='no-articles'>
          Articles not loaded yet.
        </div>
      )
    }

    return (
      <div className='article-handler'>
        { this.renderArticles() }
      </div>
    )
  }
}


var socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] })
var articleHandler = new ArticleHandler();
var articleContainer = document.getElementsByClassName('articles')[0];

React.render(
  <ArticleHandler/>,
  document.getElementById('articles')
)


