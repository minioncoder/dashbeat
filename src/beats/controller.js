'use strict';

//import Promise from 'bluebird';
//import polyfill from 'babel/polyfill';
import each from 'lodash/collection/forEach';

import logger from '../logger';
import { loopInterval } from '../helpers/constants';
import Recent from './recent';
import TopPages from './toppages';
import QuickStats from './quickstats';
import HistoricalTrafficSeries from './historicalTrafficSeries';

export default class Controller {
  constructor(app) {
    this.beats = [
      new TopPages(app),
      new QuickStats(app),
      new Recent(app),
      new HistoricalTrafficSeries(app)
    ];
    return this;
  }

  start() {
    logger.info('Starting loop...');
    each(this.beats, function(beat) {
      beat.fetch();
    });
    logger.info('...ending loop');

    setTimeout(this.start.bind(this), loopInterval);
  }
}
