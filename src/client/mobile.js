import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Velocity from 'velocity-animate';

import $ from './framework/$';

export default class MobileDashboard extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      mobile: 0,
      tablet: 0
    }
  }

  render() {
    return (
      <div className='mobile-dashboard'>
        <h2>What portion of our users are on mobile devices?</h2>
        <MobilePercentage type='mobile' percentage={ this.state.mobile }/>
        <MobilePercentage type='tablet' percentage={ this.state.tablet }/>
      </div>
    )
  }
}

export default class MobilePercentage extends React.Component {
  constructor(args) {
    super(args);

    this.rowWidth = 10;

    this.state = {
      percentage: 0,
      nextPercentage: this.props.percentage,

      // rendering states
      animating: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    let state = {
      nextPercentage: nextProps.percentage
    };

    this.setState(state);
  }

  componentDidUpdate() {
    if (this.state.percentage != this.state.nextPercentage && !this.state.animating) {
      this.animateIcons();
    }
  }

  animateIcons() {
    let node = ReactDOM.findDOMNode(this);
    let newIcons = $(node).find(`.${this.props.type} .fa.new`);
    let removeIcons = $(node).find(`.${this.props.type } .fa.remove`);

    if (this.state.animating) return;

    if (newIcons.length) {
      this.setState({ animating: true });
      Velocity(newIcons, {
        opacity: 1
      }, (elements) => {
        this.setState({
          percentage: this.state.nextPercentage,
          animating: false
        })
      })
    } else if (removeIcons.length) {
      this.setState({ animating: true });
      Velocity(removeIcons, {
        opacity: 0
      }, (elements) => {
        this.setState({
          percentage: this.state.nextPercentage,
          animating: false
        })
      })
    }
  }

  renderIcons() {
    // Get some values for the rendering
    let numToAdd = this.state.nextPercentage > this.state.percentage ? this.state.nextPercentage - this.state.percentage : 0;
    let numToRemove = this.state.percentage > this.state.nextPercentage ? this.state.percentage - this.state.nextPercentage : 0;
    let iconDelta = numToAdd || numToRemove;
    let deltaClass = '';
    if (numToAdd) {
      deltaClass = 'new';
    } else if (numToRemove) {
      deltaClass = 'remove';
    }

    function renderIcon(className='') {
      let val = (<i className={ `icon fa ${className}` }></i>)
      return val
    }

    let icons = [];
    let iconClass;
    let increment;
    if (this.props.type === 'mobile') {
      iconClass = 'fa-mobile';
    } else if (this.props.type === 'tablet') {
      iconClass = 'fa-tablet';
    } else {
      return (<div>{ `Type ${this.props.type} is not supported` }</div>)
    }

    // Render row by row, to make it easier to transition icons in and out
    let numRemaining = Math.max(this.state.nextPercentage, this.state.percentage);
    let numRows = parseInt(numRemaining / this.rowWidth);
    numRows += numRemaining % this.rowWidth ? 1 : 0;
    for (let i = 0; i < numRows; i++) {
      let cls = iconClass;
      let numIcons = numRemaining % this.rowWidth ? numRemaining % this.rowWidth : this.rowWidth;
      let numPadding = i === 0 && numIcons === this.rowWidth ? 0 : this.rowWidth - numIcons;

      // Figure out index at whcih to start adding classes (index into a 10-item row)
      let index = -1;
      if (iconDelta >= numIcons) {
        index = 0;
        iconDelta -= numIcons;
      } else if (iconDelta > 0) {
        index = numIcons - iconDelta;
        iconDelta = 0;
      }

      // Add the top row of icons, which will contain some filler icons
      for (let j = 0; j < numIcons; j++) {
        let cls = iconClass;
        if (index >= 0 && j >= index) {
          cls = `${iconClass} ${deltaClass}`;
        }
        icons.push({
          className: cls,
          type: `${iconClass}`,
          index: (numRows - i - 1) * 10 + j
        });
      }
      for (let j = 0; j < numPadding; j++) {
        icons.push({
          className: '',
          type: `${iconClass}-padding`,
          index: (numRows - i) * 10 + numIcons + j
        });
      }

      numRemaining -= numIcons;
    }

    return (
      <div className='icons-container'>
        <div className='icons'>
          {
            icons.map((option, i) => {
              return (<i className={ `icon fa ${option.className}` } key={ `${option.type}-${option.index}` }></i>)
            })
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={ `mobile-percentage ${this.props.type}` } >
        <div className='type'>{ this.props.type }</div>
        <div className='percentage'>{ this.props.percentage }</div>

        { this.renderIcons() }
      </div>
    )
  }
}

let dashboard = ReactDOM.render(
  <MobileDashboard/>,
  document.getElementById('content')
);

// Set up the socket
let socket = io('https://api.michigan.com', {transports: ['websocket', 'xhr-polling']});
socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  let snapshot = data.snapshot;
  let total = 0, mobileTotal = 0, tabletTotal = 0;

  for (var stats of snapshot.stats) {
    let m = stats.platform.m;
    let d = stats.platform.d;
    let t = stats.platform.t || 0;

    total += m + d + t;
    mobileTotal += m;
    tabletTotal += t;
  }

  let mobile = parseInt((mobileTotal / total) * 100);
  let tablet = parseInt((tabletTotal / total) * 100);

  dashboard.setState({ mobile, tablet });
});
