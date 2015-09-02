'use strict';

import DashSocket from './lib/socket';
import renderList from './jsx/popular.jsx';

var articleList = renderList([], document.getElementById('articles'));

var dash = new DashSocket(['toppages', 'quickstats']);
dash.room('toppages').on('data', function(data) {
  articleList.setState({ data: data.articles });
});

