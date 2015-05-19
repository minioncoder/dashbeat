// import $ from 'jquery-browserify';
// import _ from 'lodash';
// import io from 'socket.io-browserify';
// import article from './obj/article';

var $ = require('jquery-browserify');
var _ = require('lodash');
var io = require('socket.io-browserify');
var article = require('./obj/article');

$(function() {
  var socket = io.connect();
  socket.emit('toppages');
  socket.on('toppages', function(data) {
  	console.log(data);
    $('.articles').html('');

    _.forEach(data.articles, function(article_data) {
      var article_obj = article(article_data);
      article_obj.draw();
    });

  });
});

