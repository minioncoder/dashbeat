var config = require('../config');
var constants = require('./constants');

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var needle = Promise.promisifyAll(require('needle'));

// Required to handle an array of promises
// https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutineaddyieldhandlerfunction-handler---void
Promise.coroutine.addYieldHandler(function(yieldedValue) {
  if (Array.isArray(yieldedValue)) return Promise.all(yieldedValue);
});

function Beat(app, socket, options) {
  this.app = app;
  this.socket = socket;
  // default template for API
  var template = _.template('<%= chartbeatApi %><%= chartbeatApiString %>&apikey=<%= apiKey %>&host=');

  var defaults = {
    room: socket,
    loop: true,
    apiString: null,
    siteFilter: function() {
      return config.sites;
    }
  };

  this.opts = _.merge(defaults, options);

  if (this.opts.apiString && !this.opts.apiUrl) {
    this.opts.apiUrl = template({
      chartbeatApi: constants.chartbeatApi,
      chartbeatApiString: this.opts.apiString,
      apiKey: config.apiKey
    });
  }

  if (!this.opts.success) {
    this.opts.success = function(responses) {
      app.io.room(this.opts.room).broadcast('chartbeat', {
        responses: responses
      });
    }
  }

  // Register the route
  app.io.route(socket, function(req) {
    console.log(moment() + ' Client connected to ' + socket);
    req.io.join(socket);
  });

  this.urls = this.getUrls();
  // kickstart ChartBeat requests
  this.start();
  return this;
}

Beat.prototype.getUrls = function() {
  var that = this;
  var urls = [];
  _.forEach(this.opts.siteFilter(), function(site) {
    urls.push(that.opts.apiUrl + site);
  });
  return urls;
};

Beat.prototype.getPromises = function() {
  promises = [];
  _.forEach(this.urls, function(url) {
    promises.push(needle.getAsync(url));
  });
  return promises;
};

Beat.prototype.start = Promise.coroutine(function* () {
  // Don't do anything if no one's in this room
  if (!this.app.io.sockets.clients(this.opts.room).length) {
    if (this.opts.loop) setTimeout(_.bind(this.start, this), constants.loopInterval);
    return;
  }

  console.log(moment() + " Fetching " + this.socket);

  // Yield the responses
  try {
    responses = yield this.getPromises();
    console.log(moment() + ' Received all responses for ' + this.socket);

    var parsedResponses = [];
    _.forEach(responses, function(response) {
      if (response.length < 1) {
        console.log('Response of length ' + response.length);
        return
      }
      parsedResponses.push(response);
    });
    this.opts.success(this.app, parsedResponses);
  } catch (e) {
    console.log(moment() + " [Beat error] : " + e);
    console.log(e.stack);
  }

  if (this.opts.loop) setTimeout(_.bind(this.start, this), constants.loopInterval);
});

module.exports = Beat;
