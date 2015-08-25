/**
* @module Heartbeat
*/
'use strict';

import debug from 'debug';
var logger = debug('app:heartbeat');

import TopPages from './toppages';
import QuickStats from './quickstats';
import Referrers from './referrers';

var defaultLoopInterval = 5 * 1000;

var defaultBeats = [
  TopPages,
  QuickStats,
  Referrers
];

/**
 * The specific chartbeat data to download
 *
 * @param {Object} [app] Express application instance
 * @param {Function[]} [beats] Array of beat functions to be instantiated when server starts
 * @return {Object} The rythm that makes up a heartbeat
 */
function createRythm(app, beats=defaultBeats) {
  logger("Creating rythm ...");

  let rythm = [];
  for (let i = 0; i < beats.length; i++) {
    let beat = new beats[i](app);
    rythm.push(beat);
  }

  return rythm;
}

/**
* Kickstarts the infinite loop to grab all Chartbeat data
*
* @param {Object[]} [beats] Array of beat instances that will download chartbeat data
* @param {Number} [loopInterval] The loop timer in miliseconds
*/
async function startPacemaker(beats, loopInterval=defaultLoopInterval) {
  logger('Heart contraction ...');

  try {
    await Promise.all([for (beat of beats) beat.fetch()]);
  } catch(err) {
    logger(err);
  }

  logger(`Heart dialation, next contraction in ${loopInterval}ms ...`);

  setTimeout(startPacemaker.bind(this, beats, loopInterval), loopInterval);
}

module.exports = {
  startPacemaker,
  createRythm,
  beats: defaultBeats
};
