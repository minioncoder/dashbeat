import _ from 'lodash';

import TopPages from './toppages';
import QuickStats from './quickstats';
import Recent from './recent';
import HistoricalTrafficSeries from './historicalTrafficSeries';
import { loopInterval } from '../helpers/constants';
import { apiPaths } from '../helpers/constants';
import logger from '../logger';

class Controller {
  constructor(app) {
    this.beats = [ 
      new TopPages(app, 'toppages', '', apiPaths.toppages),
      new QuickStats(app, 'quickstats', '', apiPaths.quickstats),
      new Recent(app, 'recent', '', apiPaths.recent),
      new HistoricalTrafficSeries(app, 'historicalTrafficSeries', '', apiPaths.historicalTrafficSeries)
    ]
  }

  start() {
    logger.info('Starting loop...');
    _.forEach(this.beats, function(beat) {
      beat.fetch();
    });
    logger.info('...ending loop')

    setTimeout(this.start.bind(this), loopInterval);
  }
}

module.exports = Controller