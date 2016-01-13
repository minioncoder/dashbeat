'use strict';

import React from 'react';

import { addSlash } from '../lib/parse';

import Article from './article.js';

export default class ArticleHandler extends React.Component {
  constructor(args) {
    super(args);

    this.numDisplayed = 4;

    this.state = {
      activeArticles: [],
      lastChanged: 0
    };
  };

  static defaultProps() {
    return {
      articles: []
    };
  };

  componentDidUpdate(lastProps, lastState) {
    if (!lastProps.articles.length && this.props.articles.length) {
      setTimeout(this.rotateImage, 5000);
    }
  };

  rotateImage = () => {
    let activeArticles = this.state.activeArticles;
    let randomIndex = Math.floor(Math.random() * activeArticles.length);
    while(randomIndex === this.state.lastChanged) randomIndex = Math.floor(Math.random() * activeArticles.length);


    let randomArticleIndex = this.getRandomArticleIndex()
    activeArticles[randomIndex] = randomArticleIndex;

    let article = this.props.articles[randomArticleIndex];

    this.setState({
      activeArticles,
      lastChanged: randomIndex
    });

    setTimeout(this.rotateImage.bind(this), 5000);
  };

  getRandomArticleIndex = () => {
    let randomIndex = 0;
    for (let count = 0; count < this.props.articles.length; count++) {
      let rand = Math.floor(Math.random() * this.props.articles.length);
      if (this.state.activeArticles.indexOf(rand) < 0) {
        let article = this.props.articles[rand];
        if (article.photo && 'full' in article.photo && article.photo.full.url) {
          randomIndex = rand;
          break;
        }
      }
    }
    return randomIndex;
  };

  renderArticles = () => {
    function renderArticle(articleIndex, index) {
      let article = this.props.articles[articleIndex];
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
    );
  };

  render = () => {
    if (!this.props.articles || !this.props.articles.length) {
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
    );
  };
};
