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

module.exports = {
  getHost
}