'use strict';

import { getHostFromResponse } from '../lib/parse';
import Beat from './beat';

export default class Referrers extends Beat {
  constructor(app, name='referrers') {
    super(app, name);
  }

  parse(responses) {
    var referrers = {};
    for (let i = 0; i < responses.length; i++) {
      let resp = responses[i];
      let host = getHostFromResponse(resp);
      referrers[host] = JSON.parse(resp.body).referrers;
    }

    return referrers;
  }
}
