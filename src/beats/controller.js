/**
* @module Controller
*/
'use strict';

import debug from 'debug';
var logger = debug('app:controller');

import _each from 'lodash/collection/forEach';

import { loopInterval } from '../lib/constant';
import TopPages from './toppages';
import QuickStats from './quickstats';
import Referrers from './referrers';
// import Reports from './reports';

/**
* Controller - Sets constant loop to grab data from Beats
*
* @class
*/
export default class Controller {
  /**
  * @constructs
  * @param {String} [app] The express app instance
  * @return {Object} The Controller instance
  * @example
  *   var controller = new Controller(app).start();
  */
  constructor(app) {
    this.beats = [
      new TopPages(app),
      new QuickStats(app),
      new Referrers(app),
      // new Reports(app)
    ];
    return this;
  }

  /**
  * Kickstarts the infinite loop to grab all Chartbeat data
  *
  * @return {Object} The Controller instance
  */
  start() {
    logger('Starting loop...');
    _each(this.beats, function(beat) {
      beat.fetch();
    });
    logger('...ending loop');

    setTimeout(this.start.bind(this), loopInterval);
    return this;
  }
}
