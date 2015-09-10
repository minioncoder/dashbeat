'use strict';

import debug from 'debug';
var logger = debug('app:reports');

import moment from 'moment';
import _each from 'lodash/collection/forEach';

import Beat from './beat';
import { getHostFromResponse } from '../lib/parse';
import fs from 'fs';

/**
 * This is the Beat used for getting data for Daily Perspectives. Because
 * it's not constantly updating data, it's functionally different from other
 * and will not be activated every 5 seconds by controller.js, but will instead
 * be activated when there's an AJAX call from a client
 *
 * TODO make a cache here. We could keep 5 or so days in memory to be able to
 * serve them up quicker. I.e. loading the previous day (the day that's loaded
 * on the page) shouldnt take an API call every time, we should only have to do
 * it once
 */
export default class Report extends Beat {
  /**
   * @constructs
   * @param {Object} [app] Express app object
   * @param {String} [name] Name of Beat
   */
  constructor(app, name='reports') {
    super(app, name)

    this.cache = {};

  }

  yesterday() {
    return moment().subtract(1, 'days').format('YYYY-MM-DD');
  }

  /**
   * Fetch data. If we have data in our cache, return it
   *
   * @param {Object} res Express response object that will be used to return
   * @param {String} date - (Optional) String represending the desired day
   *    the response data
   */
  async fetch(res, date) {
    if (typeof date === 'undefined') {
      // Yesterday
      date = this.yesterday();
    }

    if (date in this.cache) {
      res.json(this.cache[date]);
      return;
    }

    this.res = res;
    this.date = date;

    super.fetch();
  }

  compileUrls(apikey, hosts) {

    let urls = [];
    _each(hosts, host => {
      urls.push(this._compileUrl({
        apikey: apikey,
        host: host,
        date: this.date
      }, 'https://chartbeat.com/report_api/reports/daily/?'));
    });
    logger(urls);
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

  parsePages(data) {
    return data;
  }

  parseAuthors(data) {
    _each(data.author_list, function(authorData) {

      delete authorData.data.overview.data.previous_series;
      delete authorData.data.overview.data.engaged_time_history;

      delete authorData.data.toppages
    });

    return data;
  }

  parseSections(data) {
    return data;
  }

  parseResponseData(data) {

    _each(data, (sectionData, sectionName) => {
      switch (sectionName) {
        case 'toppages':
          this.parsePages(sectionData);
          break;
        case 'topauthors':
          this.parseAuthors(sectionData);
          break;
        case 'topsections':
          this.parseSections(data);
          break;
        case 'overview':
          break;
        default:
          delete data[sectionName];
      }
    });

    return data;
  }

  parse(responses) {
    logger('Parsing responses');
    let data = {};
    _each(responses, (response) => {
      let host = getHostFromResponse(response);
      let body = JSON.parse(response.body);

      data[host] = this.parseResponseData(body.data);
    });
    return data;
  }

  sendData(data) {
    logger('Sending back Report data');
    logger(JSON.stringify(data).length);

    if (this.date === this.yesterday()) {
      this.cache[this.date] = data;
    }

    this.res.json(data);
  }
}
