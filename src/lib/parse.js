'use strict';
import url from 'url';

import each from 'lodash/collection/each';
import trim from 'lodash/string/trim';
import Chance from 'chance';

function isSectionPage(url) {
  return (url != "" &&
          url.indexOf('story/') === -1 &&
          url.indexOf('article/') === -1 &&
          url.indexOf('picture-gallery/') === -1 &&
          url.indexOf('longform/') === -1)
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getRandomHost(hosts) {
  var chance = new Chance();
  var numHosts = hosts.length;
  var randomIndex = chance.integer({
    min: 0,
    max: numHosts - 1
  })
  var randomHost = hosts[randomIndex];

  return randomHost;
}

function getDistance(x1, y1, x2, y2) {
  // Get deltas
  var xDelta = Math.abs(x1 - x2);
  var yDelta = Math.abs(y1 - y2);

  var xVal = Math.pow(xDelta, 2);
  var yVal = Math.pow(yDelta, 2);

  return Math.sqrt(xVal + yVal);
}

function getHostFromResponse(response) {
  /** Gets chartbeat 'host' GET param from needle response */
  var respUrl = response[0].req.path;
  var urlParts = url.parse(respUrl, true);

  if (!('host' in urlParts.query)) {
    console.log('No host param in url \'' + respUrl + '\'')
    return '';
  }

  return urlParts.query.host;
}

function parseAuthors(authors) {
  /* Given a string that represents the authors names, parse them into an array */
  if (typeof authors === 'undefined') return [];

  var parsedAuthors = [];
  each(authors, function(author) {
    var author = author.replace('the', '');
    var authorSplit = author.split(/\s+and\s+|\s*by\s+/);
    parsedAuthors = parsedAuthors.concat(authorSplit);
  });

  return [for (a of parsedAuthors) if (trim(a)) toTitleCase(trim(a).replace(/\s*by\s+/, ''))];
}

module.exports = {
  isSectionPage,
  toTitleCase,
  getRandomHost,
  getDistance,
  getHostFromResponse,
  parseAuthors
};