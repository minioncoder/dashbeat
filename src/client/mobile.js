import React from 'react'; import io from 'socket.io-client';

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

  render() {
    return (
      <div className='mobile-dashboard'>
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
  }

  renderIcons() {
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
      for (let i = 0; i < remainder; i++) { icons.push(<i className={ `icon fa ${iconClass}` }></i>) }
      for (let i = 0; i < numPadding; i++) { icons.push(<i className='icon'></i>) }
    }

    let percentage = this.props.percentage - remainder;
    for (let i = 0; i < percentage; i++) {
      icons.push(<i className={ `icon fa ${iconClass}` }></i>)
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
      <div className='mobile-percentage'>
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
