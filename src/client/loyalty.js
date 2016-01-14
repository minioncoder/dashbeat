'use strict';

import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';

import LoyaltyDashboard from './loyalty/loyalty-dashboard';
import Config from '../../config';

let socket = io(Config.socketUrl, {transports: ['websocket', 'xhr-polling']});
socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  let snapshot = data.snapshot;

  let loyalties = [];
  for (var host of snapshot.stats) {
    loyalties.push(calculatePercentages(host));
  }

  loyalties.sort(function(a, b) { return b.loyal - a.loyal; });

  if (loyalties.length > 7) {
    loyalties = loyalties.slice(0, 7);
  }

  ReactDOM.render(
    <LoyaltyDashboard loyalties={ loyalties }/>,
    document.getElementById('loyalty')
  );
});

/**
 * Calculate percentages for the different levels of visitors.
 *
 * @param {Object} hostStats - Value in the snapshot.stats array. See
 *  https://api.michigan.com/v1/snapshot/quickstats for more info on the data
 * @returns {Object} Object with the following keys
 * {
 *    source: {String}, // Freep, Detnews, etc
 *    loyal: {Number}, // > 50% of the days in the past 2 weeks
 *    returning: {Number}, // < 50% of the days in the past 2 weeks
 *    new: {Number} // no visits in the past 2 weeks
 * }
 */
function calculatePercentages(hostStats) {
  let loyalty = hostStats.loyalty;
  let total = loyalty.loyal + loyalty.returning + loyalty.new;

  return {
    source: hostStats.source,
    loyal: Math.round((loyalty.loyal / total) * 100),
    returning: Math.round((loyalty.returning / total) * 100),
    new: Math.round((loyalty.new / total) * 100)
  };
}
