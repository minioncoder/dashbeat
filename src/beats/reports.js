'use strict';

import moment from 'moment';
import _each from 'lodash/collection/forEach';

import Beat from './beat';
import logger from '../logger';
import { getHostFromResponse } from '../lib/parse';

export default class Reports extends Beat {
  constructor(app, name='reports') {
    super(app, name)
  }

  compileUrls(apikey, hosts) {
    // Yesterday
    let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

    let urls = [];
    _each(hosts, host => {
      urls.push(this._compileUrl({
        apikey: apikey,
        host: host,
        date: yesterday
      }, 'https://chartbeat.com/report_api/reports/daily/?'));
    });
    return urls;
  }

  // Override this because it doesn't use the api.chartbeat schema
  _compileUrl(args = {}, apiUrl = chartbeatApi) {
    let url = apiUrl;
    let first = true;
    for (let arg in args) {
      url += (first ? '' : '&') + arg + '=' + args[arg];
      first = false;
    }

    return url;
  }

  parse(responses) {

    let data = {};
    _each(responses, function(response) {
      let host = getHostFromResponse(response);
      let body = JSON.parse(response.body);

      data[host] = {
        articles: body.data.toppages
      }
    });
    return data;
  }
}