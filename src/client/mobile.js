import React from 'react';

export default class MobileDashboard extends React.Component {

  render() {
    return (
      <div className='mobile-dashboard'>
        <MobilePercentage type='mobile' percentage={ 54 }/>
        <MobilePercentage type='tablet' percentage={ 37 }/>
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

React.render(
  <MobileDashboard/>,
  document.getElementById('content')
)
