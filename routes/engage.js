var _ = require('lodash');
var url = require('url');
var util = require('util');

var express = require('express');
var router = express.Router();
var Beat = require('../helpers/obj/beat');

router.get('/', function(req, res, next) {
  res.render('engage', {title: 'Site Engagement'});
});


module.exports = {
  router: router,
  beat: function(app) {
    var beat = Beat({
      app: app,
      page: 'engage',
      socket: 'engage',
      apiName: 'quickstats',
      chartbeatResponse: function(responses) {
        var data = {};
        _.forEach(responses, function(response) {
          if (response.error) {
            console.log('Error: ' +  response.error);
            return;
          }
          console.log(util.inspect(response));
          var urlParts = url.parse(response.effective_url, true);
          if (!(host in urlParts)) {
            console.log('Can\'t find host for URL ' + response.effective_url);
            return;
          }

          data[urlParts.host] = response.engaged_time;

        });

        app.io.room('engage').broadcast('chartbeat', {
          engage: data
        });
      }
    });
  }
}