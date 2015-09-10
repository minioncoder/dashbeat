'use strict';

import Framework from './framework/index';
import DashSocket from './lib/socket';
import renderList from './jsx/popular.jsx';

var articleList = renderList([], document.getElementById('articles'));
var dash = new DashSocket(['toppages', 'quickstats']);

dash.room('toppages').on('data', function(data) {
  data.articles.sort(function(a, b) {
      var visitsA = parseInt(a.visits);
      var visitsB = parseInt(b.visits);

      if (visitsA == visitsB) {
          return a.title.localeCompare(b.title);
      }
      return visitsB - visitsA;
  });

  articleList.setState({ data: data.articles.slice(0, 25) });
});

dash.room('quickstats').on('data', function(data) {
  let value = 0;
  for (let stats in data) {
    value += data[stats].visits;
  }
  document.getElementById('totalReaders').innerHTML = value;
});
