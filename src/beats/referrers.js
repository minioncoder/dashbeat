'use strict';

import _each from 'lodash/collection/forEach';

import { getHostFromResponse } from '../lib/parse';
import Beat from './beat';

export default class Referrers extends Beat {
  constructor(app, name='referrers') {
    super(app, name);
  }

  parse(responses) {
    var referrers = {};
    _each(responses, function(response) {
      var host = getHostFromResponse(response);
      referrers[host] = JSON.parse(response.body).referrers;
    });

    return referrers;
  }
}