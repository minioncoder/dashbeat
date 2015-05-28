/**
* @module Controller
*/
'use strict';

import _each from 'lodash/collection/forEach';

import logger from '../logger';
import { loopInterval } from '../lib/constant';
import TopPages from './toppages';
import QuickStats from './quickstats';
import Referrers from './referrers';

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
      new Referrers(app)
    ];
    return this;
  }

  /**
  * Kickstarts the infinite loop to grab all Chartbeat data
  *
  * @return {Object} The Controller instance
  */
  start() {
    logger.info('Starting loop...');
    _each(this.beats, function(beat) {
      beat.fetch();
    });
    logger.info('...ending loop');

    setTimeout(this.start.bind(this), loopInterval);
    return this;
  }
}
