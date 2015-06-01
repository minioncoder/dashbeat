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

module.exports = {
  getHost,
  stripTags,
  addSlash
}