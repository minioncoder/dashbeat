var config = require('../config');
var constants = require('./constants');

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var needle = Promise.promisifyAll(require('needle'));


var Cache = require('../db/schema/cache');

var getCache = function(socket, successFunction) {
  /** Get the cache for this beat, and run successFunction on return

    :param successFunction: (function) Function to be run when cache is returned

                              :param cache: returned Cache model. See /db/schema/cache.model
  */

  (function(socket, successFunction) {

    // Query for this beat's cache
    Cache.model.findOne({socket: socket}, function(err, returnedCache) {
      if (err) {
      }

      // If we can't find a cache with that socket name, create a new one
      if (!returnedCache) {
        console.log('Creating Cache');
        returnedCache = new Cache.model({socket: socket});
      }

      successFunction(returnedCache);
    }).sort({createdAt: 'desc'});
  })(socket, successFunction);
}

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
    },
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
      return {
        responses: responses
      }
    }
  }

  // Register the route
  app.io.route(socket, function(req) {
    console.log(moment() + ' Client connected to ' + socket);
    req.io.join(socket);

    getCache(socket, function(returnedCache) {
      if (!returnedCache.cache) {
        console.log('no cache');
        return;
      }
      console.log('SENDING CACHE')
      app.io.room(socket).broadcast('chartbeat', returnedCache.cache);
    });
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

    // Get responses, broadcast to room, save cache
    var parsedResponse = this.opts.success(this.app, responses);
    this.app.io.room(this.socket).broadcast('chartbeat', parsedResponse);
    this.saveCache(parsedResponse);
  } catch (e) {
    console.log(moment() + " [Beat error] : " + e);
    console.log(e.stack);
  }

  if (this.opts.loop) setTimeout(_.bind(this.start, this), constants.loopInterval);
});

Beat.prototype.saveCache = function(cache) {

  console.log('creating new cache');
  console.log(this.socket);
  newCache = new Cache.model({
    socket: this.socket,
    cache: cache
  });

  newCache.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = Beat;
