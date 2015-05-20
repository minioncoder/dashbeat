'use strict';

import _ from 'lodash';

import Beat from './beat';
import { getHostFromResponse } from '../helpers/parse';

export default class historicalTrafficSeries extends Beat {
  constructor(app, name='historicalTrafficSeries', apiUrl='/historical/traffic/series/?', schema) {
    super(app, name, apiUrl, schema);
  }

  parseResponses(responses) {
    var viewersToday = {};
    var start, end, frequency;
    _.forEach(responses, function(response) {
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
