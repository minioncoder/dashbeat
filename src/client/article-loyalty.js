import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

export default class ArticleLoyaltyDashboard extends React.Component {
  renderArticle(key) {
    return function(article, index) {
      let style = {
        top: `${index * 10}%`
      }

      return (
        <div className='article' style={ style } key={ `${key}-${article.article_id}` }>
          <div className='percent'>{ `${article[key]}%` }</div>
          <div className='headline'>
            <a href={ `http://${ article.url }` } target='_blank'>{ article.headline }</a>
          </div>
        </div>
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
        { this.renderArticleColumn('loyal', 'Loyal', '> 50% of the past 16 days') }
        { this.renderArticleColumn('returning', 'Returning', '< 50% of the past 16 days') }
        { this.renderArticleColumn('new', 'New', '0 of the past 16 days') }
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
