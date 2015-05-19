'use strict';

import Chance from 'chance';
import url from 'url';

module.exports = {
  isSectionPage: function(url) {
    return (url != "" &&
            url.indexOf('story/') === -1 &&
            url.indexOf('article/') === -1 &&
            url.indexOf('picture-gallery/') === -1 &&
            url.indexOf('longform/') === -1)
  },
  toTitleCase: function (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  },
  getRandomSite: function(sites) {
    var chance = new Chance();

    var numSites = sites.length;
    var randomIndex = chance.integer({
      min: 0,
      max: numSites - 1
    })
    var randomSite = sites[randomIndex];

    return randomSite;
  },
  getDistance: function(x1, y1, x2, y2) {
    // Get deltas
    var xDelta = Math.abs(x1 - x2);
    var yDelta = Math.abs(y1 - y2);

    var xVal = Math.pow(xDelta, 2);
    var yVal = Math.pow(yDelta, 2);

    return Math.sqrt(xVal + yVal);
  },
  getHostFromResponse: function(response) {
    /** Gets chartbeat 'host' GET param from needle response */

    var respUrl = response[0].req.path;
    var urlParts = url.parse(respUrl, true);

    if (!('host' in urlParts.query)) {
      console.log('No host param in url \'' + respUrl + '\'')
      return '';
    }

    return urlParts.query.host;
  }
};