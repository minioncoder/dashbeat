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

function disconnect() {
  mongoose.disconnect();
}

var UserSchema = new Schema({
  email: { type: String, trim: true, unique: true },
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
  User: mongoose.model('Hash', UserSchema),
  BeatCache: mongoose.model('BeatCache', BeatCacheSchema),
  connect,
  disconnect
};