import moment from 'moment';
import _ from 'lodash';

import { apiKey, sites, chartbeatApi, apiPaths } from '../helpers/constants';
import HistoricalTrafficSeries from '../beats/historicalTrafficSeries';

// For getting Chartbeat API data from yesterday
class YesterdayData extends HistoricalTrafficSeries {
  compileUrls(apiKey, sites) {
    var yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    console.log(yesterday);
    var urls = [];
    _.forEach(sites, site => {
      var url = `${chartbeatApi}${this.apiUrl}start=${yesterday}%2000:00:00&end=${yesterday}%2023:59:59&apikey=${apiKey}&host=${site}`
      console.log(url);
      urls.push(url);
    });
    return urls;
  }
}

function init(app) {
  app.get('/viewers', function(req, res, next) {
    res.render('viewers', { title: 'Daily Viewers' });

    // TODO make this hash/ID based so you can make different rooms
    // for different API keys
    app.io.route('yesterdayData', function(req, res, next) {
      console.log('Fetching yesterday data');
      req.io.join('yesterdayData');
      // TODO pull API keys from DB based on hash
      var yesterdayData = new YesterdayData(app, 'yesterdayData', '', apiPaths.historicalTrafficSeries);
      yesterdayData.fetch();
    });
  });
}

module.exports = {
  init: init
};
