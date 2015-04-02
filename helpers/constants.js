module.exports = {
  chartbeatApi: 'http://api.chartbeat.com',
  apiPaths: {
    toppages: '/live/toppages/v3/?limit=50',
    recent: '/live/recent/v3/?limit=50',
    quickstats: '/live/quickstats/v3/?'
  },
  cacheExpiration: 5, // 5 seconds
  mognoUrl: 'mongodb://localhost:27017/dashbeat',
  loopInterval: 5000
};