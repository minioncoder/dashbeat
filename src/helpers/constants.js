module.exports = {
  chartbeatApi: 'http://api.chartbeat.com',
  apiPaths: {
    toppages: '/live/toppages/v3/?limit=50',
    recent: '/live/recent/v3/?limit=50',
    quickstats: '/live/quickstats/v3/?',
    historicalTrafficSeries: '/historical/traffic/series/?'
  },
  cacheExpiration: 5, // 5 seconds
  loopInterval: 5000
};