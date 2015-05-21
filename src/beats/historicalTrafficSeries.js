'use strict';

import each from 'lodash/collection/forEach';

import { getHostFromResponse } from '../helpers/parse';
import Beat from './beat';

export default class historicalTrafficSeries extends Beat {
  constructor(app, name='historicalTrafficSeries', apiUrl='/historical/traffic/series/?', schema) {
    super(app, name, apiUrl, schema);
  }

  parseResponses(responses) {
    var viewersToday = {};
    var start, end, frequency;
    each(responses, function(response) {
      var data = response[1].data;
      var host = getHostFromResponse(response);
      start = data.start;
      end = data.end;
      frequency = data.frequency;

      if (!(host in data)) {
        console.log('Host ${host} not found');
        return;
      }
      viewersToday[host] = data[host].series;

    });

    return {
      start,
      end,
      frequency,
      viewersToday
    }
  }
}
