// import $ from 'jquery-browserify';
// import _ from 'lodash';
// import io from 'socket.io-browserify';
// import article from './obj/article';

var $ = require('jquery-browserify');
var _ = require('lodash');
var io = require('socket.io-browserify');
var Article = require('./obj/article');
var sha1 = require('crypto').createHash('sha1');

$(function() {
  function generateId(url) {
    /*  Given a URL of an article, generate a unique key for it */
    sha1.update(url);
    return sha1.digest('hex');
  }

  var socket = io.connect();
  socket.emit('toppages');
  socket.on('toppages', function(data) {
  	console.log(data);
    $('.articles').html('');

    _.forEach(data.articles, function(articleData) {
      var id = generateId(articleData.path);

      // If this article isn't currently drawn to the screen, draw it
      if (!$('#' + id).length) {
        $('.articles').append('<div class=\'article-container\' id=' + id + '></div>');
      }

      var article = new Article(articleData, id);
    });

  });
});

