'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var babelify = require("babelify");
var reactify = require('reactify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sequence = require('run-sequence');
var watchify = require('watchify');
var reactify = require('reactify');
var sass = require('gulp-sass');

var jsSrc = './public/js/src/';
var jsDist = './public/js/dist/';
var jsBundle = [
  'authors.js', 'engage.js', 'geo.js',
  'popular.js', 'recirculation.js', 'stats.js',
  'viewers.js'
];

var cssSrc = './public/scss/';
var cssDist = './public/css/';
var cssFiles = cssSrc + '**/*.scss';


gulp.task('sass', function() {
  gutil.log('Compiling SASS files');
  return gulp.src(cssFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDist));
});

gulp.task('browserify', function() {
  forEach(jsBundle, function(fname) {
    bundlejs(fname);
  });
});

gulp.task('watch', function() {
  forEach(jsBundle, function(fname) {
    gutil.log('Watching ' + fname + ' ...');
    gulp.watch(jsSrc + fname, function() {
      bundlejs(fname);
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

  gutil.log('Generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
});

gulp.task('default', function() {
  sequence('babel', 'browserify', 'sass');
});

function bundlejs(file, src, dist) {
  if (typeof src === 'undefined') src = jsSrc;
  if (typeof dist === 'undefined') dist = jsDist;
  src = addSlash(src);
  dist = addSlash(dist);

  var srcFull = src + file;
  var distFull = dist + file;

  if (!fs.existsSync(srcFull)) {
    gutil.log('Could not find ' + srcFull + ', ignoring')
    return;
  }

  gutil.log('Generating ' + distFull);

  var b = browserify(srcFull, { debug: true });
  return b.transform(reactify)
    .bundle()
    .pipe(source(file))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist));
    // .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    //     .pipe(uglify())
    //     .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    //.pipe(gulp.dest(dist));
}

function addSlash(path) {
  return path.slice(-1) == '/' ? path : path + '/';
}

function forEach(obj, cb, context) {
  for (var i = 0, len = obj.length; i < len; i++) {
    if (context === undefined) cb(obj[i], i);
    else cb.call(context, obj[i], i);
  }
}