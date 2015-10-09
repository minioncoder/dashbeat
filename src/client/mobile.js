import React from 'react';
import io from 'socket.io-client';
import Velocity from 'velocity-animate';

import $ from './framework/$';


export default class MobileDashboard extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      percentage: {
        mobile: 0,
        tablet: 0
      }
    }
  }

  updatePercentage(e) {
    let name = e.target.name;
    let value = e.target.value;
    if (!(name in this.state.percentage)) return;

    let state = { percentage: {} };
    state.percentage[name] = value;
    this.setState(state);
  }

  renderTestInput() {
    return (
      <div className='test-input'>
        <input type='number' name='mobile' value={ this.state.percentage.mobile } onChange={ this.updatePercentage.bind(this) }/>
        <input type='number' name='tablet' value={ this.state.percentage.tablet} onChange={ this.updatePercentage.bind(this) }/>
      </div>
    )
  }

  render() {
    return (
      <div className='mobile-dashboard'>
        { this.renderTestInput() }
        <MobilePercentage type='mobile' percentage={ this.state.percentage.mobile }/>
        <MobilePercentage type='tablet' percentage={ this.state.percentage.tablet }/>
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
      percentageChange: this.props.percentage ? true : false,
      animating: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    let state = {
      nextPercentage: nextProps.percentage
    };

    if (this.state.percentage != nextProps.percentage) {
      state.percentageChange = true;
    }

    this.setState(state);
  }

  componentDidUpdate() {
    //this.animateIcons();
  }

  animateIcons() {
    let newIcons = $(`.${this.props.type} .fa.new`);
    let removeIcons = $(`.${this.props.type } .fa.remove`);

    if (this.state.animating) return;
    this.setState({ animating: true });

    if (newIcons.length) {
      Velocity(newIcons, {
        opacity: 1
      }, (elements) => {
        this.setState({
          percentage: this.state.nextPercentage,
          animating: false
        })
      })
    } else if (removeIcons.length) {
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
    let numToDraw = Math.max(this.state.percentage, this.state.nextPercetage);
    let numToAdd = this.state.nextPercentage > this.state.percentage ? this.state.nextPercentage - this.state.percentage : 0;
    let numToRemove = this.state.percentage > this.state.nextPercentage ? this.state.percentage - this.state.nextPercentage : 0;
    function renderIcon(className='') {

      if (numToAdd) {
        numToAdd -= 1;
        className += ' new';
      } else if (numToRemove) {
        numToRemove -= 1;
        className += ' remove';
      }

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

    // Figure out the placeholders so the gaps are on the top row instead of the bottom
    let remainder = this.props.percentage % this.rowWidth;
    if (remainder) {
      let numPadding = this.rowWidth - remainder;

      // Add the top row of icons, which will contain some filler icons
      for (let i = 0; i < remainder; i++) { icons.push(renderIcon(iconClass)); }
      for (let i = 0; i < numPadding; i++) { icons.push(<i className='icon'></i>); }
    }

    let percentage = this.props.percentage - remainder;
    for (let i = 0; i < percentage; i++) {
      icons.push(renderIcon(iconClass));
    }

    return (
      <div className='icons-container'>
        <div className='icons'>
          { icons }
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

let dashboard = React.render(
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

  dashboard.setState({
    percentage: { mobile, tablet }
  });
});
