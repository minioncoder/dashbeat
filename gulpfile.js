'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var crash_sound;
try {
  crash_sound = require('gulp-crash-sound');
} catch (e) {}

var uuid = require('uuid');
var babelify = require("babelify");
var reactify = require('reactify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var each = require('lodash/collection/forEach');
var browserify_shim = require('browserify-shim');

var config = require('./config');

var jsSrc = './public/js/src/';
var jsBundle = [
  'authors.js', 'engage.js', 'geo.js',
  'popular.js', 'recirculation.js', 'stats.js',
  'viewers.js'
];

gulp.task('sass', function() {
  var cssSrc = './public/scss/';
  var cssDist = './public/css/';
  var cssFiles = cssSrc + '**/*.scss';

  gutil.log('Compiling SASS files ...');

  return gulp.src(cssFiles)
    .pipe(sass({
      includePaths: ['./node_modules']
    }).on('error', gutil.log))
    .pipe(gulp.dest(cssDist));
});

gulp.task('browserify', function(cb) {
  var bcb = (function() {
    var counter = 0;
    return function() {
      counter++;
      if (counter == jsBundle.length) return cb();
    };
  })();
  each(jsBundle, function(fname) {
    bundlejs(fname, bcb);
  });
});

gulp.task('watch', function() {
  each(jsBundle, function(fname) {
    gutil.log('Watching ' + fname + ' ...');
    gulp.watch(jsSrc + fname, function() {
      return bundlejs(fname);
    });
  });

  gutil.log('Watching node modules ...');
  gulp.watch('./src/**/*.js', ['babel']);

  gutil.log('Watching scss files ...');
  gulp.watch('./public/scss/**/*.scss', ['sass']);
});

gulp.task('babel', function() {
  var src = './src/**/*.js';
  var dist = './dist';

  gutil.log('Babel is generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
});

gulp.task('default', ['sass', 'babel', 'browserify']);

gulp.task('addUsers', function(cb) {
  var db = require('./dist/db');
  db.connect();
  gutil.log('Adding default user for development ...');
  var user = new db.User({
    'email': 'ebower@michigan.com',
    'apiKey': config.apiKey,
    'sites': config.sites,
    'hash': uuid.v4()
  }).save(function(err, model) {
    if (err) throw new Error(err);
    gutil.log('Saved default user!');
    db.disconnect();
    cb();
  });
});

gulp.task('users', function(cb) {
  var db = require('./dist/db');
  db.connect();
  db.User.find().exec(function(err, results) {
    if (err) throw new Error(err);
    gutil.log(JSON.stringify(results, null, 2));
    db.disconnect();
    cb();
  });
});

gulp.task('resetDb', function(cb) {
  var db = require('./dist/db');
  db.connect();
  gutil.log('Removing User documents ...');
  db.User.remove().exec(function(err) {
    if (err) throw new Error(err);
    gutil.log('Removing BeatCache documents ...');
    db.BeatCache.remove().exec(function() {
      db.disconnect();
      cb();
    });
  });
});

function bundlejs(file, bcb, src, dist) {
  if (typeof src === 'undefined') src = jsSrc;
  if (typeof dist === 'undefined') dist = './public/js/dist/';

  var srcFull = src + file;
  var distFull = dist + file;

  if (!fs.existsSync(srcFull)) {
    gutil.log('Could not find ' + srcFull + ', ignoring')
    return;
  }

  gutil.log('Browserify is compiling ' + distFull + ' from ' + srcFull);

  var b = browserify(srcFull, { debug: true });
  return b
    .transform(babelify, { stage: 0 })
    .transform(reactify)
    .transform(browserify_shim, { global: true })
    .bundle()
    .pipe(source(file))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .on('error', gutil.log)
    //  .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
    .on('end', function() {
      gutil.log('Browserify finished creating: ' + distFull);
      if (typeof bcb === 'function') bcb();
    });
}
