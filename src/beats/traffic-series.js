'use strict';

import each from 'lodash/collection/forEach';

import { getHostFromResponse } from '../lib/parse';
import Beat from './beat';

export default class TrafficSeries extends Beat {
  constructor(app, name='traffic/series', schema=undefined, apiType='historical') {
    super(app, name, schema, apiType);
  }

  parse(responses) {
    var viewersToday = {};
    var start, end, frequency;
    each(responses, function(response) {
      var data = response[1].data;
      var host = getHostFromResponse(response);
      start = data.start;
      end = data.end;
      frequency = data.frequency;

      if (!(host in data)) {
        console.log(`Host ${host} not found`);
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
