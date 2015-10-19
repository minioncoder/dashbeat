'use strict';

import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate';

export default class ArticleLoyaltyDashboard extends React.Component {
  renderArticle(key) {
    return function(article, index) {
      return (
        <Article type={ key } article={ article } rank={ index } key={ `${key}-${article.article_id}` }/>
      )
    }
  }

  renderArticleColumn = (columnType, displayName, blurb) => {
    let articles;
    if (columnType === 'loyal') articles = this.props.topLoyal;
    else if (columnType === 'returning') articles = this.props.topReturning;
    else if (columnType === 'new') articles = this.props.topNew;
    else return null;


    return (
      <div className={ `column ${columnType}` }>
        <div className='title'>{ displayName }</div>
        <div className='blurb'>{ blurb }</div>
        <div className='article-container'>
          { articles.map(this.renderArticle(columnType)) }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='dashboard'>
        <h1 className='splainer'>Which Articles Attract Which Readers?</h1>
        <div className='dashboard-container'>
          { this.renderArticleColumn('loyal', 'Loyal', '8+ visits in the past 16 days') }
          { this.renderArticleColumn('returning', 'Returning', '2-7 visits in the past 16 days') }
          { this.renderArticleColumn('new', 'New', 'first visit in the past 16 days') }
        </div>
      </div>
    )
  }
}

class Article extends React.Component {
  componentDidMount() {
    this.animateArticle();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.rank != this.props.rank) this.animateArticle();
  }

  animateArticle = () => {
    let style = {
      top: `${ this.props.rank * 10 }%`
    }

    Velocity(ReactDOM.findDOMNode(this), style);
  }

  render() {
    let type = this.props.type;
    let article = this.props.article;
    return (
      <div className='article'>
        <div className='percent'>{ `${article[type]}%` }</div>
        <div className='headline'>
          <a href={ `http://${ article.url }` } target='_blank'>{ article.headline }</a>
        </div>
      </div>
    )
  }
}

let MIN_CONCURRENTS = 10;
let socket = io('https://api.michigan.com/', { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_popular');
socket.on('got_popular', (data) => {
  let articles = data.snapshot.articles;

  let articlePercentages = [];
  for (let article of articles) {
    if (article.visits < MIN_CONCURRENTS) continue;
    let loyalty = article.loyalty;
    let total = loyalty.loyal + loyalty.returning + loyalty.new;

    articlePercentages.push({
      article_id: article.article_id,
      headline: article.headline,
      url: article.url,
      loyal: Math.round((loyalty.loyal / total) * 100),
      returning: Math.round((loyalty.returning / total) * 100),
      new: Math.round((loyalty.new / total) * 100),
    });
  }


  function keySortDesc(key) {
    return function(a, b) {
      return b[key] - a[key];
    }
  }
  let topLoyal = articlePercentages.sort(keySortDesc('loyal')).slice(0, 10);
  let topReturning = articlePercentages.sort(keySortDesc('returning')).slice(0, 10);
  let topNew = articlePercentages.sort(keySortDesc('new')).slice(0, 10);

  ReactDOM.render(
    <ArticleLoyaltyDashboard topLoyal={ topLoyal }
        topReturning={ topReturning }
        topNew={ topNew }/>,
    document.getElementById('article-loyalty')
  )

});
