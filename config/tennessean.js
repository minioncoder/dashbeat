'use strict';

var generatePostCSSMixins = require('./index').generatePostCSSMixins;

var sites = [{
  'name': 'Tennessean',
  'domain': 'tennessean.com',
  'color': '#2095F2'
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
  'market': 'tennessean',
  'socketUrl': 'http://api.tennessean.work',
  'sites': sites,
  'dashboards': dashboards,
  'mixins': generatePostCSSMixins(sites)
};
