'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var crash_sound;
try {
  crash_sound = require('gulp-crash-sound');
} catch (e) {}

var babelify = require("babelify");
var reactify = require('reactify');
var browserify = require('browserify');
var browserify_shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var each = require('lodash/collection/forEach');

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

gulp.task('user', function(cb) {

});

gulp.task('reset_db', function(cb) {
  var db = require('./dist/db');
  db.connect();
  gutil.log('Removing UserSchema documents ...');
  db.User.remove().exec(function() {
    gutil.log('Removing BeatCacheSchema documents ...');
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
