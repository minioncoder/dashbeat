'use strict';

import _each from 'lodash/collection/forEach';

import logger from '../logger';
import { getHostFromResponse } from '../lib/parse';
import Beat from './beat';

export default class QuickStats extends Beat {
  constructor(app, name='quickstats') {
    super(app, name);
  }

  parse(responses) {
    var stats = {};
    _each(responses, function(response) {
      var host = getHostFromResponse(response);
      stats[host] = JSON.parse(response.body);
    });

    return stats;
  }
}
