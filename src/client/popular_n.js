'use strict';

import DashSocket from './lib/socket';
import renderList from './jsx/popular.jsx';

var articleStore = {};
var container = document.getElementById('articles');

var dash = new DashSocket(['toppages', 'quickstats']);
dash.room('toppages').on('data', function(data) {
  data.articles.sort(function(a, b) {
    return parseInt(b.visits) - parseInt(a.visits);
  });
});

var data = [
    {visits: 100, path:'http://google.com/', title:'Some title', authors:['one', 'two']},
    {visits: 200, path:'http://poop.com/', title:'Another title', authors:['three', 'four']}
];

renderList(data, document.getElementById('articles'));

