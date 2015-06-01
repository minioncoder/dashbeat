'use strict';

import keys from 'lodash/object/keys';
import Framework from './framework/index';
import DashSocket from './lib/socket';
import Chance from 'chance';
import request from 'request';
import { addSlash } from './lib/parse';

// JSX
import Article from './jsx/big-picture/article.jsx';

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
  }

  /**
   * Saves a list of articles
   * @memberof ArticleHandler#
   * @param {Array} [articles] Sorted lists of article objects. Map article URL to
   *    article object in this.articles
   */
  saveArticles(articles) {
    this.articles = articles;
  }

  /**
   * Every 5 seconds, rotate one of the articles
   * @memberof ArticleHandler#
   */
  rotateArticles() {
    if (this.articles.length) {
      var numCurrentDisplayed = keys(this.displayedArticles).length;
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
  }

  /**
   * Handles the drawing of the first four articles
   * @memeberof ArticleHandler#
   */
  drawInitialArticles() {

    for (let i = 0; i < this.numArticlesToDraw; i++) {
      let containerId = 'article-' + i;
      this.drawArticle(containerId);
    }
  }

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
  }

  getRandomArticle() {
    if (!this.articles.length) return {};
    let chance = new Chance();

    let randomInt = chance.integer({
      min: 0,
      max: this.articles.length - 1
    });

    return this.articles[randomInt];
  }

  /**
   * Fetches an article's JSON feed and looks for a
   */
  fetchArticleJson(article, containerId) {

    // See if we have this image cached
    if (article.path in this.articleImages) {

      if (!(containerId in this.displayedArticles)) {
        this.displayedArticles[containerId] = new Article(article, containterId);
      }
      else {
        this.displayedArticles[containerId].renderNewArticle(article, imageUrl);
      }
      return;
    }

    request({
      baseUrl: document.location.origin,
      url: '/get-article/',
      qs: {
        url: article.path + 'json'
      }
    },
    (error, response, body) => {
      if (error) throw new Error(error);

      try {
        body = JSON.parse(body);
      }
      catch(e) {
        throw new Error(e);
      }

      if (!('article' in body)) {
        throw new Error('No article attribute found in body');
        return;
      }
      else if (!('lead_photo' in body.article)) {
        throw new Error('No lead_photo in body.article: ' + article.path);
        return;
      }
      // TODO some more validation

      let imageUrl = body.article.lead_photo.asset_metadata.crops['16_9'];

      if (!(containerId in this.displayedArticles)) {
        this.displayedArticles[containerId] = new Article({ article, imageUrl }, containerId);
      }
      else {
        this.displayedArticles[containerId].renderNewArticle(article, imageUrl);
      }

      this.articleImages[containerId] = imageUrl;
    });
  }
}

function getRemainderOfHeight(container) {
  let windowHeight = window.innerHeight;
  let containerTop = container.offsetTop;
  if (windowHeight <= containerTop) return;

  return windowHeight - containerTop - 5;
}

function resize() {
  articleContainer.style.height = getRemainderOfHeight(articleContainer) + 'px';
}

var dash = new DashSocket(['toppages']);
var articleHandler = new ArticleHandler();
var articleContainer = document.getElementsByClassName('articles')[0];
window.onresize = resize;
resize();

dash.room('toppages').on('data', function(data) {
  let articles = data.articles;
  articles = articles.sort(function(a, b) {
    return parseInt(b.visits) - parseInt(a.visits);
  });

  articles = articles.slice(0, 50); // Keep the top 20 articles

  articleHandler.saveArticles(articles);
});
