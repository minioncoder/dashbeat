'use strict';

import _ from 'lodash';

import logger from '../logger';
import Beat from './beat';
import { isSectionPage, getHostFromResponse } from '../helpers/parse';

export default class TopPages extends Beat {
  constructor(app, name='toppages', apiUrl='/live/toppages/v3/?limit=50', schema) {
    super(app, name, apiUrl, schema);
  }

  parseResponses(responses) {
    var articles = {};
    // parse chartbeat response data
    _.forEach(responses, function(response) {
      var host = getHostFromResponse(response);
      articles[host] = [];
      
      _.forEach(response[1].pages, function(article) {
        if (isSectionPage(article.path)) return;

        articles[host].push({
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
