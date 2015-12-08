'use strict';

var conf = require('./index');

var freep = '#2095F2';
var detroitnews = '#F34235';
var lansingstatejournal = '#FEEA3A';
var hometownlife = '#B3E9F8';
var battlecreekenquirer = '#9800FE';
var thetimesherald = '#8AC249';
var livingstondaily = '#CD54B0';

var sites = [{
  'name': 'The Free Press',
  'domain': 'freep.com',
  'color': freep
}, {
  'name': 'The Detroit News',
  'domain': 'detroitnews.com',
  'color': detroitnews
}, {
  'name': 'Lansing State Journal',
  'domain': 'lansingstatejournal.com',
  'color': lansingstatejournal
}, {
  'name': 'Hometownlife',
  'domain': 'hometownlife.com',
  'color': hometownlife
}, {
  'name': 'Battle Creek Enquirer',
  'domain': 'battlecreekenquirer.com',
  'color': battlecreekenquirer
}, {
  'name': 'The Times Herald',
  'domain': 'thetimesherald.com',
  'color': thetimesherald
}, {
  'name': 'Livingston Daily',
  'domain': 'livingstondaily.com',
  'color': livingstondaily
}];

module.exports = {
  'socketUrl': 'https://api.michigan.com',
  'sites': sites,
  'dashboards': conf.dashboards,
  'mixins': conf.generatePostCSSMixins(sites)
};
