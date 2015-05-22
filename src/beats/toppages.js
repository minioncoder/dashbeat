'use strict';

import each from 'lodash/collection/forEach';

import logger from '../logger';
import { Toppages } from '../db';
import { isSectionPage, getHostFromResponse, parseAuthors } from '../lib/parse';
import Beat from './beat';

export default class TopPages extends Beat {
  constructor(app, name='toppages', schema=Toppages) {
    super(app, name, schema);
  }

  parse(responses) {
    let articles = [];
    // parse chartbeat response data
    each(responses, function(response) {
      let host = getHostFromResponse(response);
      each(response[1].pages, function(article) {
        if (isSectionPage(article.path)) return;
        articles.push({
          host: host,
          path: article.path,
          title: article.title,
          visits: article.stats.visits,
          authors: parseAuthors(article.authors)
        });
      });
    });

    return articles;
  }
}
