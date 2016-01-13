'use strict';

var conf = require('./index');

var sites = [{
  'name': 'Mansfield News Journal',
  'domain': 'mansfieldnewsjournal.com',
  'color': '#2095F2'
}, {
  'name': 'Newark Advocate',
  'domain': 'newarkadvocate.com',
  'color': '#F34235'
}, {
  'name': 'Times Recorder',
  'domain': 'zanesvilletimesrecorder.com',
  'color': '#FEEA3A'
}, {
  'name': 'Chillicothe Gazette',
  'domain': 'chillicothegazette.com',
  'color': '#B3E9F8'
}, {
  'name': 'Lancaster Eagle-Gazette',
  'domain': 'lancastereaglegazette.com',
  'color': '#9800FE'
}, {
  'name': 'The Marion Star',
  'domain': 'marionstar.com',
  'color': '#8AC249'
}, {
  'name': 'The News-Messenger',
  'domain': 'thenews-messenger.com',
  'color': '#CD54B0'
}, {
  'name': 'Coshocton Tribune',
  'domain': 'coshoctontribune.com',
  'color': '#000'
}, {
  'name': 'Telegraph-Forum',
  'domain': 'bucyrustelegraphforum.com',
  'color': '#fff'
}, {
  'name': 'News Herald',
  'domain': 'portclintonnewsherald.com',
  'color': '#999'
}];

module.exports = {
  'market': 'ohio',
  'socketUrl': 'http://api.hio.rocks',
  'sites': sites,
  'dashboards': conf.dashboards,
  'mixins': conf.generatePostCSSMixins(sites)
};
