'use strict';

import _ from 'lodash';

import logger from '../logger';
import Beat from './beat';
import { getHostFromResponse } from '../helpers/parse';

export default class QuickStats extends Beat {
  parseResponses(responses) {
    var stats = {};
    _.forEach(responses, function(response) {
      // console.log(util.inspect(response[0].req));
      var host = getHostFromResponse(response);
      stats[host] = response[1];
    });

    return stats;
  }
}
