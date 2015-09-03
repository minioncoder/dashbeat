'use strict';

import DashSocket from './lib/socket';
import renderList from './jsx/popular.jsx';

var articleList = renderList([], document.getElementById('articles'));

var dash = new DashSocket(['toppages', 'quickstats']);
dash.room('toppages').on('data', function(data) {
  var sortedCopy = data.articles.slice().sort(function(a, b) {
      var visitsA = parseInt(a.visits);
      var visitsB = parseInt(b.visits);

      if (visitsA == visitsB) {
          return a.title.localeCompare(b.title);
      }
      return visitsB - visitsA;
  });
  articleList.setState({ data: sortedCopy });
});

