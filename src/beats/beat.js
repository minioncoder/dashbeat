/**
* @module Beat
*/
'use strict';

import moment from 'moment';
import needle from 'needle';
import Promise from 'bluebird';
import polyfill from 'babel/polyfill';
import each from 'lodash/collection/forEach';

import { User } from '../db';
import logger from '../logger';
import { chartbeatApi, loopInterval } from '../lib/constants';

var getAsync = Promise.promisify(needle.get);

// Required to handle an array of promises
// https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutineaddyieldhandlerfunction-handler---void
Promise.coroutine.addYieldHandler(function(yieldedValue) {
  if (Array.isArray(yieldedValue)) return Promise.all(yieldedValue);
});

/**
* Beat - Base class used to grab all chartbeat request data, save it, and send it over a socket
*
* @class
*/
export default class Beat {
  /**
  * @constructs
  * @param {String} [app] The express app instance
  * @param {String} [name] The name of the chartbeat API, must match the exact API type
  * @return {Object} The Beat instance
  * @example
  *   var beat = new Beat(app, 'toppages');
  */
  constructor(app, name, schema, apiType='live', version=3, limit=50) {
    Object.assign(this, { app, name, schema, apiType, version, limit });
    this.createSocket();
    return this;
  }

  /**
  * Connects to socket under the API name
  *
  * @memberof Beat#
  * @return {Object} The Beat instance
  */
  createSocket() {
    this.app.io.route(this.name, req => {
      logger.info('Connected to ' + this.name);
      req.io.join(this.name);
    });
    return this;
  }

  /**
  * Function called by the Controller on each beat. Should hit the DB to get the
  * API keys that it needs to use to fetch data (TODO), for now it pulls from
  * config.js
  *
  * @memberof Beat#
  * @return {Object} The coroutine
  */
  fetch() {
    return Promise.coroutine(function* () {
      logger.info(`Fetching ${this.apiUrl} for ${this.name}`);
      //var apiInfo = [{ apikey, hosts }];
      let apiInfo;
      try {
        apiInfo = yield User.find().exec();
      } catch (e) {
        logger.error(e);
      }

      if (!apiInfo.length) {
        logger.warn('No User records, cannot request chartbeat data');
        return;
      }

      each(apiInfo, info =>
        this.get(info.apikey, info.hosts)
      );
    }.bind(this))();
  }

  /**
  * Given an apikey and a list of hosts, compile all the chartbeat URLs
  * that will be called.
  *
  * @memberof Beat#
  * @param {String} [apikey] Chartbeat API key
  * @param {Array} [hosts] Hosts that will be called
  * @return {Array} Compiled host names
  *
  */
  compileUrls(apikey, hosts) {
    let urls = [];
    each(hosts, host => {
      urls.push(this._compileUrl({
        apikey: apikey,
        host: host
      }));
    });

    return urls;
  }

  /**
  * Compiles Chartbeat API URL based
  *
  * @memberof Beat#
  * @param {String} [apiUrl] Chartbeat API URL: http://api.chartbeat.com
  * @param {String} [apiType] Chartbeat API type: live, historical
  * @param {String} [name] The Chartbeat API name: toppages, quickstats, recent
  * @param {Number|String} [version] The Chartbeat API version number
  * @param {Object} [args] The request GET values to append to the request: apikey=123, host=freep.com, limit=50
  * @return {String} The formated chartbeat API URL
  */
  _compileUrl(args = {}, apiUrl = chartbeatApi) {
    let defaults = { limit: 50 };
    Object.assign(args, defaults);

    let url = [apiUrl, this.apiType, this.name, 'v' + this.version, '?'].join('/');
    let first = true;
    for (let arg in args) {
      url += (first ? '' : '&') + arg + '=' + args[arg];
      first = false;
    }
    return url;
  }

  /**
  * For a given apikey and hosts combo, make all the requests to Chartbeat, and send requests through socket
  *
  * @memberof Beat#
  * @param {String} [apikey] Chartbeat API key
  * @param {Array} [hosts] Hosts that for which we will hit the chartbeat API for for data
  * @return {Object} The Beat instance
  */
  get(apikey, hosts) {
    let urls = this.compileUrls(apikey, hosts);
    return Promise.coroutine(function* (urls) {
      let responses = yield [for (url of urls) getAsync(url)];

      logger.info(`Received responses for: ${this.name}`);
      let data = this.parse(responses);
      try {
        data = yield this.save(data);
        data = data.articles;
      } catch (e) {
        console.log(e);
      }
      this.app.io.room(this.name).broadcast(this.name, data);
    }.bind(this))(urls);
  }

  /**
  * Default method that needs to be overridden
  *
  * @memberof Beat#
  * @param {Array} [responses] The Chartbeat response data
  * @return {Array} The Chartbeat response data
  */
  parse(responses) {
    logger.debug('Default parse called for ' + this.apiUrl);
    return responses;
  }

  /**
  * Saves documents in Schema
  */
  save(data) {
    if (typeof this.schema === 'undefined') return Promise.reject(`'schema' not found in ${this.name}`);
    return Promise.coroutine(function* () {
      let doc = new this.schema({
        articles: data
      });
      return doc.save();
    }.bind(this))();
  }
}
