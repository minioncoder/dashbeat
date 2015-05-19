var _ = require('lodash');

var config = require('./config');
var db = require('./dist/db/db');
var schemas = require('./dist/db/schema/schemas');

var mongo = db.MongoClient;

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      watch: {
        files: [{
          cwd: './public/javascripts/src',
          expand: true,     // Enable dynamic expansion.
          src: ['*.js'], // Actual pattern(s) to match.
          dest: './public/javascripts/dist',
          ext: '.js',   // Dest filepaths will have this extension.
          extDot: 'first'   // Extensions in filenames begin after the first dot
        }],
        options: {
          watch: true,
          keepAlive: true,
          browserifyOptions: {
            debug: true
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('db-reset', 'Drops and creates collections', function() {
    var done = this.async();

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

      done();
    });
  });
}