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

  save(data) {
    super.save(data);
    let doc = new this.schema({
      articles: data
    });
    return doc.save();
  }
}
