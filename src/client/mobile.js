import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Velocity from 'velocity-animate';

import $ from './framework/$';


/*
 * TODO when we remake this page, look at this for inspiration
 *
 * http://uimovement.com/ui/569/minimal-dashboard/
 *
 */

export default class MobileDashboard extends React.Component {
  render() {
    return (
      <div className='mobile-dashboard'>
        <h2>What portion of our users are on mobile devices?</h2>
        <MobilePercentage type='mobile' percentage={ this.props.mobile }/>
      </div>
    )
  }
}

export default class MobilePercentage extends React.Component {
  constructor(args) {
    super(args);

    this.totalIcons = 1000;
  }

  renderBar() {
    let style = {
      width: `${this.props.percentage}%`
    }
    return (
      <div className='battery-container'>
        <div className='padding'></div>
        <div className='battery'>
          <div className='bar' style={ style }>
          </div>
        </div>
        <div className='padding'></div>
      </div>
    )
  }

  render() {
    return (
      <div className={ `mobile-percentage ${this.props.type}` } >
        <div className='type'>{ this.props.type }</div>
        <div className='percentage'>{ this.props.percentage }</div>

        { this.renderBar() }
      </div>
    )
  }
}


// Set up the socket
let socket = io('https://api.michigan.com', {transports: ['websocket', 'xhr-polling']});
socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  let snapshot = data.snapshot;
  let total = 0, mobileTotal = 0, tabletTotal = 0;

  for (var stats of snapshot.stats) {
    let m = stats.platform_engaged.m;
    let d = stats.platform_engaged.d;
    let t = stats.platform_engaged.t || 0;

    total += m + d + t;
    mobileTotal += m;
    tabletTotal += t;
  }

  let mobile = ((mobileTotal / total) * 100);
  let tablet = ((tabletTotal / total) * 100);

  // http://stackoverflow.com/a/7343013/1337683
  mobile = Math.round(mobile * 10) / 10;
  tablet = Math.round(tablet * 10) / 10;

  ReactDOM.render(
    <MobileDashboard mobile={ mobile } tablet={ tablet }/>,
    document.getElementById('content')
  );
});
