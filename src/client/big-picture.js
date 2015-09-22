'use strict';

import io from 'socket.io-client';
import Chance from 'chance';
import request from 'request';

import Framework from './framework/index';
import { addSlash } from './lib/parse';

import Article from './jsx/big-picture.jsx';

var articleHandler = new ArticleHandler();
var articleContainer = document.getElementsByClassName('articles')[0];

window.onresize = resize;
resize();

var socket = io('https://api.michigan.com', {transports: ['websocket', 'xhr-polling']});
socket.emit('get_popular');
socket.on('got_popular', function(data) {
  let articles = data.articles;
  articles = articles.sort(function(a, b) {
    return parseInt(b.visits) - parseInt(a.visits);
  });

  articles = articles.slice(0, 50); // Keep the top 20 articles

  articleHandler.saveArticles(articles);
});

/**
 * ArticleHandler - Controls the drawing of articles to the page. At any time
 * there are 4 articles with their images drawn to the page. This class handles
 * the shuffling of those articles
 *
 * @class
 */
class ArticleHandler {
  /**
   * @constructs
   */
  constructor() {
    this.articles = [];
    this.displayedArticles = {};
    this.numArticlesToDraw = 4;
    this.articleImages = {};

    this.rotateArticles();
  };

  /**
   * Saves a list of articles
   * @memberof ArticleHandler#
   * @param {Array} [articles] Sorted lists of article objects. Map article URL to
   *    article object in this.articles
   */
  saveArticles(articles) {
    this.articles = articles;
  };

  /**
   * Every 5 seconds, rotate one of the articles
   * @memberof ArticleHandler#
   */
  rotateArticles() {
    if (this.articles.length) {
      var numCurrentDisplayed = Object.keys(this.displayedArticles).length;
      if (!numCurrentDisplayed) {
        this.drawInitialArticles();
      }
      else {
        // TODO figure out which article to draw next
        let chance = new Chance();
        let randomContainer = chance.integer({
          min: 0,
          max: numCurrentDisplayed - 1
        });
        this.drawArticle('article-' + randomContainer);
      }
    }

    setTimeout(this.rotateArticles.bind(this), 5000);
  };

  /**
   * Handles the drawing of the first four articles
   * @memeberof ArticleHandler#
   */
  drawInitialArticles() {
    for (let i = 0; i < this.numArticlesToDraw; i++) {
      let containerId = 'article-' + i;
      this.drawArticle(containerId);
    }
  };

  /**
   * Draws a random article to the article container with id=[containerId]
   * @memberof ArticleHandler#
   * @param {String} [containerId] DOM ID of the article container
   */
  drawArticle(containerId) {
    let url = containerId in this.displayedArticles ? this.displayedArticles[containerId].path : '';

    let count = 0;
    let article = this.getRandomArticle();
    // TODO make sure we didnt choose a currently-displayed article

    this.fetchArticleJson(article, containerId);
  };

  getRandomArticle() {
    if (!this.articles.length) return {};
    let chance = new Chance();

    let randomInt = chance.integer({
      min: 0,
      max: this.articles.length - 1
    });

    return this.articles[randomInt];
  };
};

function getRemainderOfHeight(container) {
  let windowHeight = window.innerHeight;
  let containerTop = container.offsetTop;
  if (windowHeight <= containerTop) return;

  return windowHeight - containerTop - 5;
}

function resize() {
  articleContainer.style.height = getRemainderOfHeight(articleContainer) + 'px';
}
