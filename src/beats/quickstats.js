'use strict';

import each from 'lodash/collection/forEach';

import logger from '../logger';
import { getHostFromResponse } from '../lib/parse';
import Beat from './beat';

export default class QuickStats extends Beat {
  constructor(app, name='quickstats') {
    super(app, name);
  }

  parse(responses) {
    var stats = {};
    each(responses, function(response) {
      // console.log(util.inspect(response[0].req));
      var host = getHostFromResponse(response);
      stats[host] = response[1];
    });

    return stats;
  }
}
