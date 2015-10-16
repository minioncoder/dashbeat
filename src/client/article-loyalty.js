import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

export default class ArticleLoyaltyDashboard extends React.Component {
}

let socket = io('https://api.michigan.com/', { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_toppages');
socket.on('got_toppages', (data) => {
  let articles = data.snapshot.articles;

  let articlePercentages = [];
  for (let article of articles) {
    let loyalty = articles.stats.loyalty;
    let total = loyalty.loyal + loyalty.returning + loyalty.new;

    articlePercentages.push({
      source: article.source,
      loyal: parseInt((loyalty.loyal / total) * 100),
      returning: parseInt((loyalty.returning / total) * 100),
      new: parseInt((loyalty.new / total) * 100)
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

});
