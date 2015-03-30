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

function Beat(options) {
  var that = this;
  // default template for API
  var template = _.template('<%= chartbeatApi %><%= chartbeatApiString %>&apikey=<%= apiKey %>&host=');

  var defaults = {
    app: null,
    socket: null,
    room: null,
    loop: true,
    apiString: null,
    siteFilter: function() {
      return config.sites;
    }
  };

  this.opts = _.merge(defaults, options);

  this.app = this.opts.app;
  if (!this.app) throw("Application instance 'app' required in Beat options");

  this.socket = this.opts.socket;
  if (!this.socket) throw("Socket name 'socket' required in Beat options");

  this.opts.room = this.socket;

  if (this.opts.apiString && !this.opts.apiUrl) {
    this.opts.apiUrl = template({
      chartbeatApi: constants.chartbeatApi,
      chartbeatApiString: this.opts.apiString,
      apiKey: config.apiKey
    });
  }

  if (!this.opts.success) {
    this.opts.success = function(responses) {
      that.app.io.room(this.opts.room).broadcast('chartbeat', {
        responses: responses
      });
    }
  }

  // Register the route
  this.app.io.route(this.socket, function(req) {
    console.log(moment() + ' Client connected to ' + that.socket);
    req.io.join(that.socket);
  });

  this.urls = this.getUrls();
  this.promises = this.getPromises();
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
    responses = yield this.promises;
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
