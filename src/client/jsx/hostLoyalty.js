import React from 'react';
import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate';

import { sourceMap } from '../lib/';

export default class HostLoyalty extends React.Component {

  componentDidMount() { this.animate(); }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.rank !== this.props.rank) this.animate();
  }

  animate = () => {
    let style = {};
    if (this.props.rank === 1) {
      style = { top: '0%', left: '0%' };
    }  else if (this.props.rank > 1 && this.props.rank < 5) {
      let multiplier = this.props.rank - 2;
      style = { top: '33%', left:  `${ (1/3) * 100 * multiplier }%`}
    } else if (this.props.rank > 4 && this.props.rank < 8) {
      let multiplier = this.props.rank - 5;
      style = { top: '66%', left: `${ (1/3) * 100 * multiplier }%` }
    }

    Velocity(ReactDOM.findDOMNode(this), style);
  }

  renderStats() {
    let loyalStyle = { height: `${this.props.loyal}%` };
    let returningStyle = { height: `${this.props.returning}%` };
    let newStyle = { height: `${this.props.new}%` };

    return (
      <div className='loyalty-stats'>
        <div className='stat loyal'>
          <div className='bar-container'>
            <div className='bar' style={ loyalStyle }></div>
          </div>
          <div className='label'>Loyal</div>
          <div className='percent'>{ `${this.props.loyal}%` }</div>
        </div>
        <div className='stat returning'>
          <div className='bar-container'>
            <div className='bar' style={ returningStyle }></div>
          </div>
          <div className='label'>Returning</div>
          <div className='percent'>{ `${this.props.returning}%` }</div>
        </div>
        <div className='stat new'>
          <div className='bar-container'>
            <div className='bar' style={ newStyle }></div>
          </div>
          <div className='label'>New</div>
          <div className='percent'>{ `${this.props.new}%` }</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='host-loyalty'>
        <div className='rank'>{ this.props.rank }</div>
        <div className='source'>{ sourceMap[this.props.source] || '' }</div>
        { this.renderStats() }
      </div>
    )
  }
}
