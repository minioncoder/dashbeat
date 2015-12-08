var dashboards = [
  'popular',
  'big-picture',
  'mobile',
  'cities',
  'loyalty',
  'article-loyalty',
  'status',
  'author-percent',
  'authors',
  'geo-point',
  'stats',
  'recirculation',
  'viewers',
  'test-socket'
];

/**
 * Given an array of sites representing markets, generate the Postcss mixins for
 * those markets
 *
 * @param {Array} sites - Array of site config info, see ./README.md for more info
 * @returns {Object} -  postcss-mixin config info
 */
function generatePostCSSMixins(sites) {
  var colors = {};
  for (var i = 0; i < sites.length; i++) {
    var site = sites[i];
    var className = '.' + site.domain.replace(/\.\w+$/, '');
    colors[className] = {
      'background-color': site.color
    }
  }

  return {
    sites: function() {
      return colors;
    }
  }
}

module.exports = {
  generatePostCSSMixins: generatePostCSSMixins,
  dashboards: dashboards
}