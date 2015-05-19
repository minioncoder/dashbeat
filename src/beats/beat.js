'use strict';

import polyfill from 'babel/polyfill';

import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import needle from 'needle';

import logger from '../logger';
import { apiKey, sites } from '../../config';
import { chartbeatApi, loopInterval } from '../helpers/constants';

var getAsync = Promise.promisify(needle.get);

// Required to handle an array of promises
// https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutineaddyieldhandlerfunction-handler---void
Promise.coroutine.addYieldHandler(function(yieldedValue) {
  if (Array.isArray(yieldedValue)) return Promise.all(yieldedValue);
});

class Beat {
  constructor(app, name, schema, apiUrl) {
    this.app = app;
    this.name = name;
    this.schema = schema;
    this.apiUrl = apiUrl;

    this.createSocket();

    return this;
  }

  createSocket() {
    this.app.io.route(this.name, req => {
      logger.info('Connected to ' + this.name);
      req.io.join(this.name);
    });
  }

  /*  Function called by the Controller on each beat. Should hit the DB to get the
   *  API keys that it needs to use to fetch data (TODO), for now it pulls from 
   *  config.js
   *
   */
  fetch() {
    logger.info('Fetching ' + this.apiUrl);
    // TODO get all API keys
    // For now just read from config.js
    var apiInfo = [{ apiKey, sites }];
    _.forEach(apiInfo, info => 
      this.callChartbeat(info.apiKey, info.sites)
    );
  }

  /*  Given an apiKey and a list of sites, compile all the chartbeat URLs
   *  that will be called.
   *
   *  :param apiKey:  (String) Chartbeat API key
   *  :param sites:   (Array) Array of host sites that will be called 
   *  
   *  :return: (Array) array of compiled site names. sites.length === return.length
   *
   */
  compileUrls(apiKey, sites) {
    var urls = [];
    _.forEach(sites, site => {
      var url = `${chartbeatApi}${this.apiUrl}&apikey=${apiKey}&host=${site}`;
      urls.push(url);
    });

    return urls;
  }

  /*  For a given apiKey and sites combo, make all the requests to Chartbeat
   *
   *  :param apiKey:  (String) Chartbeat API key
   *  :param sites:   (Array) Array of hosts that for which we will hit the 
   *                    chartbeat API for for data
   */
  callChartbeat(apiKey, sites) {
    var that = this;
    var start = Promise.coroutine(function* (urls) { 
      // Compile all the promises together
      var promises = [];
      _.forEach(urls, function(url) {
        promises.push(getAsync(url));
      });

      var responses = yield promises;
      var parsed = that.parseResponses(responses);
      that.app.io.room(that.name).broadcast(that.name, parsed);
    });

    var urls = this.compileUrls(apiKey, sites);
    start(urls);
  }

  /*  Default method that needs to be overridden
   *
   */
  parseResponses(responses) {
    console.log('Got responses for ${this.apiUrl} beat');
  }
}

module.exports = Beat;
