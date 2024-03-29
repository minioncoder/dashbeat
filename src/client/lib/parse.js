'use strict';

function getHost(url) {
  var hostPattern = /(?:^http(s?):\/\/)?(?:[a-zA-Z]+\.){0,1}(?:[a-zA-Z0-9][a-zA-Z0-9-]+){1}(?:\.[a-zA-Z]{2,6})+/;
  var match = hostPattern.exec(url);
  if (match.length) {
    return match[0];
  }
  else {
    return '';
  }
}

/**
 * Given an HTML string, strip out the tags and just return the words
 * http://stackoverflow.com/a/822464/1337683
 *
 * @param {String} html - HTML string
 */
function stripTags(html) {
  return html.replace(/<(?:.|\n)*?>/gm, '');
}


/**
 * Given a string [url], add a slash to the end of the url if necessary
 *
 * @param {String} url - URL to slash-ify
 */
function addSlash(url) {
  if (url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
}

/**
 * Gets a meaningful referrer name from a url. E.g. t.co -> Twitter
 *
 * @param {String} [referrer] URL of a referrer
 * @return {String} Meaningful referrer name
 */
function parseReferrer(referrer) {
  let DARK_SOCIAL = 'Dark Social';
  if (!referrer) return DARK_SOCIAL;

  let key = referrer;
  if (referrer === 'news.google.com') {
    key = 'Google News';
  }
  else if (referrer === 'news.google.com') {
    key = 'Google News';
  }
  else if (referrer === 'r.search.yahoo.com') {
    key = 'Yahoo Search';
  }
  else if (referrer === 'tpc.googlesyndication.com') {
    key = 'Google Ad Sense';
  }
  else if (referrer === 'hsrd.yahoo.com') {
    key = 'Yahoo News';
  }
  else if (referrer.indexOf('google.') != -1) {
    key = 'Google Search';
  }
  else if (referrer === 't.co' || referrer.indexOf('twitter.') != -1) {
    key = 'Twitter';
  }
  else if (referrer.indexOf('facebook.') != -1) {
    key = 'Facebook';
  }
  else if (referrer.indexOf('taboola.') != -1) {
    key = 'Direct Related Articles';
  }
  else if (referrer.indexOf('reddit.') != -1) {
    key = 'Reddit';
  }
  else if (referrer.indexOf('bleacherreport.') != -1) {
    key = 'Bleacher Report';
  }

  return key;
}

/**
 * Because of JSX parsing, it doesn't look like you can put ES6 string templates
 * in HTML attributes. This is a simple wrapper which allows you to do so
 *
 * @param {String} [string] String to be generated
 * @return {String} returns [string] argument
 */
function generateString(string) {
  return string;
}

// http://stackoverflow.com/a/196991/1337683
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// http://stackoverflow.com/a/11832950/1337683
function roundTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
  getHost,
  stripTags,
  addSlash,
  parseReferrer,
  generateString,
  toTitleCase,
  roundTwoDecimals,
  numberWithCommas
}
