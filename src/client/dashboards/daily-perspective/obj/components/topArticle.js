import React from 'react';
import { Pie as PieChart } from 'react-chartjs';

import StatListItem from './statListItem';
import SimpleStat from './simpleStat';
import { TwitterStat, FacebookStat } from './socialStat';

// Color palet based on michigan.com green
//
// http://paletton.com/#uid=72E0u0kkCrqaRHdgcvHp7o6snj3
let colors = {
  michGreen: '#72BF44',
  michGreenHover: '#55A824',

  michTurqoise: '#349173',
  michTurqoiseHover: '#1B805F',

  michRed: '#C94765',
  michRedHover: '#B02646',

  michOrange: '#DA7D4E',
  michOrangeHover: '#C05C29'
}

export default class TopArticle extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      showSummary: false
    }
  }

  showSummary = () => {
    this.setState({
      showSummary: true
    });
  }

  getReferralChartData() {
    let stats = this.props.data.data.stats;

    // Calculate the percentages

    return [{
      value: stats.direct_pct || 0,
      label: 'Direct',
      color: colors.michGreen,
      highlight: colors.michGreeHover
    }, {
      value: stats.links_pct || 0,
      label: 'Links',
      color: colors.michTurqouise,
      highlight: colors.michTurqoiseHover
    }, {
      value: stats.social_pct || 0,
      label: 'Social',
      color: colors.michRed,
      highlight: colors.michRedHover
    }, {
      value: stats.search_pct || 0,
      label: 'Search',
      color: colors.michOrange,
      highlight: colors.michOrangeHover
    }];
  }

  renderSummary() {
    let data = this.props.data.data;


    return (
      <div className='top-article-summary'>
        <div className='summary-container'>
          <div className='summary-content'>
            <div className='article-title'>{ data.title }</div>
            <PieChart data={ this.getReferralChartData() }/>
          </div>
        </div>
      </div>
    )

  }

  render() {
    let data = this.props.data.data;
    let summary = this.state.showSummary ? this.renderSummary() : null;

    return(
      <div className='top-article'>
        <div className='article-title'>{ data.title }</div>
        <div className='article-quick-stats'>
          <div className='left'>
            <StatListItem name='Total Engaged' data={ data.stats.total_engaged } unit='min'/>
            <SimpleStat name='Avg. Engaged' data={ data.stats.engaged_time } unit='sec'/>
          </div>
          <div className='right'>
            <div className='social-stats'>
              <FacebookStat data={ data.stats.facebook_likes }/>
              <TwitterStat data={ data.stats.twitter_shares }/>
            </div>
            <div onClick={ this.showSummary } className='details-button'>
              Details
            </div>
          </div>
        </div>
        { summary }
      </div>
    )
  }
}
