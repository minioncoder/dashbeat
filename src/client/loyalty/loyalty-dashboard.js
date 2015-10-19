'use strict';

import React from 'react';

import HostLoyalty from './host';

export default class LoyaltyDashboard extends React.Component {
  renderLegend() {
    return (
      <div className='about'>
        <div className='title'>Yours Truly, ...</div>
        <div className='subtitle'>Are they rubber-neckers, or regular readers? How can we convert casual traffic to loyal subscribers? What does each site do differently that affects these numbers?</div>
        <div className='legend'>
          <div className='item loyal'>
            <div className='swatch'></div>
            <div className='label'>{ 'Loyal — Percentage of current users who have visited 8 days of the past 16' }</div>
          </div>
          <div className='item returning'>
            <div className='swatch'></div>
            <div className='label'>{ 'Returning — Current users who have visited 2 to 7 of the past 16 days' }</div>
          </div>
          <div className='item new'>
            <div className='swatch'></div>
            <div className='label'>{ 'New — Percentage of users visiting for the first time in the last 16 days' }</div>
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
