/** 
  Modernizr doesn't play well with browserify, so in order to get
  shufflejs to work I have to import all this stuff in by hand. Wanted
  to self contain it in one JS fil3
  */

require('browsernizr/test/css/transitions');
require('browsernizr/test/css/transforms');
// require('browsernizr/test/css/transforms3d');
require('browsernizr/lib/prefixed');

window.Modernizr = Modernizr = require('browsernizr');
var shuffle = require('../../../bower/shufflejs/dist/jquery.shuffle.min');

module.exports = shuffle;