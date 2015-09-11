import React from 'react';
import numeral from 'numeral';

export default class SimpleStatItem extends React.Component {

  render() {
    let number = numeral(this.props.data).format('0,0[.00]');
    number = this.props.unit ? `${number} ${this.props.unit}` : number;
    return (
      <div className='stat-item'>
        <div className='stat-name'>{ this.props.name }</div>
        <div className='stat-value'>{ number }</div>
      </div>
    )
  }
}
