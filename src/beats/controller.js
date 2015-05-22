/**
* @module Controller
*/
'use strict';

//import Promise from 'bluebird';
//import polyfill from 'babel/polyfill';
import each from 'lodash/collection/forEach';

import logger from '../logger';
import { loopInterval } from '../lib/constants';
import Recent from './recent';
import TopPages from './toppages';
import QuickStats from './quickstats';
import TrafficSeries from './traffic-series';

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
      new Recent(app),
      new TrafficSeries(app)
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
    each(this.beats, function(beat) {
      beat.fetch();
    });
    logger.info('...ending loop');

    setTimeout(this.start.bind(this), loopInterval);
    return this;
  }
}
