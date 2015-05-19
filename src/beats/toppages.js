'use strict';

import _ from 'lodash';

import logger from '../logger';
import Beat from './beat';
import * as parse from '../helpers/parse';

class TopPages extends Beat {
  parseResponses(responses) {
    var articles = [];
    // parse chartbeat response data
    _.forEach(responses, function(response) {
      _.forEach(response[1].pages, function(article) {
        if (parse.isSectionPage(article.path)) return;

        articles.push({
          path: article.path,
          title: article.title,
          visits: article.stats.visits,
          authors: article.authors
        });
      });
    });

    return {
      articles
    }
  }
}

module.exports = TopPages