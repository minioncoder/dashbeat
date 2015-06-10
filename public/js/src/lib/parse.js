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

module.exports = {
  getHost,
  stripTags,
  addSlash,
  parseReferrer
}