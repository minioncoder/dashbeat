'use strict';

import _ from 'lodash';

import logger from '../logger';
import { loopInterval } from '../helpers/constants';
import TopPages from './toppages';
import QuickStats from './quickstats';
import Recent from './recent';
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
    _.forEach(this.beats, function(beat) {
      beat.fetch();
    });
    logger.info('...ending loop');

    setTimeout(this.start.bind(this), loopInterval);
  }
}
