'use strict';

import { getHostFromResponse } from '../lib/parse';
import Beat from './beat';

export default class QuickStats extends Beat {
  constructor(app, name='quickstats') {
    super(app, name);
  }

  parse(responses) {
    var stats = {};

    for (let i = 0; i < responses.length; i++) {
      let resp = responses[i];
      let host = getHostFromResponse(resp);
      stats[host] = JSON.parse(resp.body);
    }

    return stats;
  }
}
