'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sequence = require('run-sequence');

var jsSrc = './public/js/src/';
var jsDist = './public/js/dist/';
var jsBundle = [
  'authors.js', 'engage.js', 'geo.js',
  'popular.js', 'recirculation.js', 'stats.js',
  'viewers.js'
];

gulp.task('less', function() {
  gutil.log('Generating CSS files');
  return gulp.src('./public/less/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('browserify', function() {
  forEach(jsBundle, function(fname) {
    bundlejs(fname);
  });
});

gulp.task('watch', function() {
  forEach(jsBundle, function(fname) {
    gutil.log('Watching ' + fname);
    gulp.watch(jsSrc + fname, function() {
      bundlejs(fname);
    });
  });

  gulp.watch('./public/less/**/*.less', ['less']);
});

gulp.task('babel', function() {
  var src = './src/**/*.js';
  var dist = './dist';

  gutil.log('Generating ES6 -> ES5 files');

  return gulp.src(src)
    .pipe(babel({ stage: 0 }))
    .pipe(gulp.dest(dist));
});

gulp.task('default', function() {
  sequence('babel', 'browserify', 'less');
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
  return b.bundle()
    .pipe(source(file))
    // .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    //     .pipe(uglify())
    //     .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist));
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