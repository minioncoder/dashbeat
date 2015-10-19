'use strict';

import React from 'react';
import xr from 'xr';

import { addSlash } from '../lib/parse';

import Article from './article.js';

export default class ArticleHandler extends React.Component {
  constructor(args) {
    super(args);

    this.numDisplayed = 4;

    this.state = {
      articles: [],
      activeArticles: [],
      lastChanged: 0
    }
  }

  componentDidMount() {
    this.fetchArticles();
  }


  fetchArticles = () => {
    xr.get('https://api.michigan.com/v1/news', { limit: 100 })
      .then(res => {
        this.setState({
          articles: res.articles
        });

        setTimeout(this.rotateImage.bind(this), 5000);
      });

    setTimeout(this.fetchArticles, 1000 * 60 * 10);
  }

  rotateImage = () => {
    let activeArticles = this.state.activeArticles;
    let randomIndex = Math.floor(Math.random() * activeArticles.length);
    while(randomIndex === this.state.lastChanged) randomIndex = Math.floor(Math.random() * activeArticles.length);


    let randomArticleIndex = this.getRandomArticleIndex()
    activeArticles[randomIndex] = randomArticleIndex;

    let article = this.state.articles[randomArticleIndex];
    console.log(`Replacing article at index ${randomIndex} with ${article.headline}`)


    this.setState({
      activeArticles,
      lastChanged: randomIndex
    });

    setTimeout(this.rotateImage.bind(this), 5000);
  }

  getRandomArticleIndex = () => {
    let randomIndex = 0;
    for (let count = 0; count < this.state.articles.length; count++) {
      let rand = Math.floor(Math.random() * this.state.articles.length);
      if (this.state.activeArticles.indexOf(rand) < 0) {
        let article = this.state.articles[rand];
        if (article.photo && 'full' in article.photo && article.photo.full.url) {
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
        <Article imageUrl={ article.photo.full.url }
          headline={ article.headline }
          url={ article.url }
          article_id={ article.article_id }
          key={ `article-${index}` }/>
      )
    }
    while (this.state.activeArticles.length < 4) this.state.activeArticles.push(this.getRandomArticleIndex())

    return (
      <div className='articles'>
        { this.state.activeArticles.map(renderArticle.bind(this)) }
      </div>
    )
  }

  render = () => {
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
