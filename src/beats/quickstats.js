'use strict';

import each from 'lodash/collection/forEach';

import logger from '../logger';
import { getHostFromResponse } from '../helpers/parse';
import Beat from './beat';

export default class QuickStats extends Beat {
  constructor(app, name='quickstats', apiUrl='/live/quickstats/v3/?', schema) {
    super(app, name, apiUrl, schema);
  }

  parseResponses(responses) {
    var stats = {};
    each(responses, function(response) {
      // console.log(util.inspect(response[0].req));
      var host = getHostFromResponse(response);
      stats[host] = response[1];
    });

    return stats;
  }
}
