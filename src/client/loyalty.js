import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import HostLoyalty from './jsx/hostLoyalty';

export default class LoyaltyDashboard extends React.Component {
  renderLegend() {
    return (
      <div className='about'>
        <div className='title'>Loyalty</div>
        <div className='subtitle'>Which one of our markets commands the highest percentage of loyal readers?</div>
        <div className='legend'>
          <div className='item loyal'>
            <div className='swatch'></div>
            <div className='label'>{ 'Loyal -  > 50% of the days over the last 16 days.' }</div>
          </div>
          <div className='item returning'>
            <div className='swatch'></div>
            <div className='label'>{ 'Return - < 50% of the days over the last 16 days.' }</div>
          </div>
          <div className='item new'>
            <div className='swatch'></div>
            <div className='label'>{ 'New - 0 days in the last 16 days' }</div>
          </div>
        </div>
      </div>
    )
  }

  renderSources() {
    function renderSource(option, index) {
      return (
        <HostLoyalty source={ option.source }
            loyal={ option.loyal }
            returning={ option.returning }
            new={ option.new }
            rank={ index + 1 }
            key={ `host-${option.source}` }/>
      )
    }

    return (
      <div className='sources'>
        { this.props.loyalties.map(renderSource.bind(this))}
      </div>
    )
  }

  render() {
    return (
      <div className='dashboard'>
        { this.renderLegend() }
        { this.renderSources() }
      </div>
    )
  }
}

let socket = io('https://api.michigan.com', {transports: ['websocket', 'xhr-polling']});
socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  let snapshot = data.snapshot;

  let loyalties = [];
  for (var host of snapshot.stats) {
    loyalties.push(calculatePercentages(host));
  }

  loyalties.sort(function(a, b) { return b.loyal - a.loyal; });

  ReactDOM.render(
    <LoyaltyDashboard loyalties={ loyalties }/>,
    document.getElementById('loyalty')
  )
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
    loyal: parseInt((loyalty.loyal / total) * 100),
    returning: parseInt((loyalty.returning / total) * 100),
    new: parseInt((loyalty.returning / total) * 100)
  }
}
