'use strict';

import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate';
import assign from 'object-assign';

/*
 * TODO when we remake this page, look at this for inspiration
 *
 * http://uimovement.com/ui/569/minimal-dashboard/
 *
 */

export default class MobilePercentage extends React.Component {
  constructor(args) {
    super(args);

    this.totalIcons = 500;
    this.state = assign({}, this.getWidth());
    window.onResize = this.resize.bind(this);
  }

  componentDidMount() {
    this.state = assign({}, this.getWidth());
  }

  resize() {
    this.setState(assign({}, this.getWidth()));
  }

  getWidth() {
    let width = window.innerWidth * .8;
    let height = width * .5;

    return { height, width }
  }

  renderIcons() {
    // Get some values for the rendering
    let numActiveIcons = (this.props.percentage) * 5;
    let numInactiveIcons = this.totalIcons - numActiveIcons;

    let icons = [];
    let iconClass;
    if (this.props.type === 'mobile') {
      iconClass = 'fa-mobile';
    } else if (this.props.type === 'tablet') {
      iconClass = 'fa-tablet';
    } else {
      return (<div>{ `Type ${this.props.type} is not supported` }</div>)
    }

    for (let i = 0; i < numActiveIcons; i++) {
      icons.push(
        <div className='icon-container active' key={ `active-${i}` }>
          <img src='/img/iphone-active.svg'/>
        </div>
      );
    }

    for (let i = 0; i < numInactiveIcons; i++) {
      icons.push(
        <div className='icon-container inactive' key={ `inactive-${i}` }>
          <img src='/img/iphone.svg'/>
        </div>
      );
    }

    return (
      <div className='icons'>
        { icons }
      </div>
    )
  }

  render() {
    return (
      <div className={ `mobile-percentage ${this.props.type}` } >
        <div className='percentage'>{ this.props.percentage }</div>
        { this.renderIcons() }
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
    (
      <div className='mobile-dashboard'>
        <h2>What portion of our users are on mobile devices?</h2>
        <MobilePercentage type='mobile' percentage={ mobile }/>
      </div>
    ),
    document.getElementById('content')
  );
});
