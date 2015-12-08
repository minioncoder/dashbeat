'use strict';

var generatePostCSSMixins = require('./index').generatePostCSSMixins;

var usatoday = '#2095F2';

var sites = [{
  'name': 'USA Today',
  'domain': 'usatoday.com',
  'color': usatoday
}];

var dashboards = [
  'popular',
  'big-picture',
  'cities',
  'article-loyalty',
  'status',
  'author-percent',
  'authors',
  'geo-point',
  'stats',
  'recirculation',
  'viewers',
  'test-socket'
]

module.exports = {
  'socketUrl': 'http://api.thepul.se',
  'sites': sites,
  'dashboards': dashboards,
  'mixins': generatePostCSSMixins(sites)
};
