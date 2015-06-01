'use strict';

import _each from 'lodash/collection/forEach';

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
    _each(responses, function(response) {
      let body = JSON.parse(response.body);
      let host = getHostFromResponse(response);
      _each(body.pages, function(article) {
        if (isSectionPage(article.path)) return;

        let urlAppends = ['www.', 'http://'];
        for (let i = 0; i < urlAppends.length; i++) {
          let append = urlAppends[i];
          if (article.path.indexOf(append) !== 0) {
            article.path = append + article.path;
          }
        }
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
