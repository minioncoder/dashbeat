'use strict';

import each from 'lodash/collection/forEach';

import logger from '../logger';
import { isSectionPage, getHostFromResponse, parseAuthors } from '../helpers/parse';
import Beat from './beat';


export default class TopPages extends Beat {
  constructor(app, name='toppages', apiUrl='/live/toppages/v3/?limit=50', schema) {
    super(app, name, apiUrl, schema);
  }

  parseResponses(responses) {
    var articles = {};
    // parse chartbeat response data
    each(responses, function(response) {
      var host = getHostFromResponse(response);
      articles[host] = [];

      each(response[1].pages, function(article) {
        if (isSectionPage(article.path)) return;
        articles[host].push({
          path: article.path,
          title: article.title,
          visits: article.stats.visits,
          authors: parseAuthors(article.authors)
        });
      });
    });

    return { articles };
  }
}
