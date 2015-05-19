'use strict';

import path from 'path';

import morgan from 'morgan';
import log4js from 'log4js';
import mongoose from 'mongoose';
import express from 'express.io';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { connect } from './db';
import mail from './mail';
import logger from './logger';
import beats from './routes/beats';

var app = express();
app.http().io();

var BASE_DIR = path.dirname(__dirname);

// view engine setup
app.set('views', path.join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(BASE_DIR, 'public')));
app.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG }));

// http://stackoverflow.com/a/27464258/1337683
app.use('/css', express.static(path.join(BASE_DIR, '/node_modules/leaflet/dist')));
app.use('/img', express.static(path.join(BASE_DIR, '/node_modules/leaflet/dist/images')));

connect();
mongoose.connection.on('error', logger.error);
mongoose.connection.on('disconnected', connect);

// Init beats
beats.initBeats(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logger.error(err);

  mail.mailOptions.text = `
  Status: ${err.status}
  -----
  Request: ${req.originalUrl}
  -----
  Error: ${err.message}
  -----
  Stacktrace: ${err.stack}`;

  mail.transporter.sendMail(mail.mailOptions, function(error, info) {
    logger.error(error);
  });

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.on('SIGTERM', function () {
  logger.info("Closing nodejs application ...");
  app.close();
});

app.on('close', function () {
  logger.info("Closed nodejs application, disconnecting mongodb ...");
  mongoose.disconnect();
});


module.exports = app;
