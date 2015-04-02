var _ = require('lodash');
var schemas = require('./schema/schemas');
var constants = require('../helpers/constants');

// Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect(constants.mognoUrl);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


function createDb() {
  // Use connect method to connect to the Server
  MongoClient.connect(constants.mognoUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to Mongodb server");

    // Create all collections
    // Create tables and stuff
    _.forEach(schemas.all, function(schema) {
      console.log(schema.name);
      var collection = db.collection(schema.name);
    });
  });
}

module.exports = {
  MongoClient: MongoClient,
  mongoose: mongoose
};