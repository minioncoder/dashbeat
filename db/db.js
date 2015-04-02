var _ = require('lodash');
var config = require('../config');

// Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

module.exports = {
  MongoClient: MongoClient,
  mongoose: mongoose
};