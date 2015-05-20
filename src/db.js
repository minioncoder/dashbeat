'use strict';

import mongoose from 'mongoose';

import { db } from '../config';
var Schema = mongoose.Schema;

if (typeof db === 'undefined') {
  throw new Error("`db` key in config.js is required to connect to mongodb, ex: db: 'mongodb://localhost:27017/db'");
}

const defaults = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

function connect(options=defaults) {
  mongoose.connect(db, options);
}

var UserSchema = new Schema({
  name: { type: String, trim: true, },
  hash: { type: String },
  apiKey: { type: String },
  sites: [{ type: String }]
});

var BeatCacheSchema = new Schema({
  beat: {
    type: String,
    trim: true,
  },
  cache: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//var ToppagesSchema = new Schema({});

module.exports = {
  UserSchema: mongoose.model('Hash', UserSchema),
  BeatCacheSchema: mongoose.model('BeatCache', BeatCacheSchema),
  connect
};