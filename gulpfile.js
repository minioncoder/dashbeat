var gulp = require('gulp');
var _ = require('lodash');

var config = require('./config');
var db = require('./db/db');
var schemas = require('./db/schema/schemas');

var mongo = db.MongoClient;

gulp.task('db-reset', function() {

  console.log(config.mongoUrl);
  mongo.connect(config.mongoUrl, function(err, db) {
    console.log('Connected to DB, dropping all collections');

    // Iterate over all schema names, drop all of them
    _.forEach(schemas.all, function(schema) {
      console.log('Dropping collection ' + schema.collectionName);
      var collection = db.collection(schema.collectionName);

      collection.drop(function(err, reply) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});