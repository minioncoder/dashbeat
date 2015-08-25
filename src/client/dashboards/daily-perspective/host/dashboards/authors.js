
import React from 'react';
import { toTitleCase } from 'publicLib/parse';
import { DeltaValue, DaySeries, SocialShares } from './common';

export default class Authors extends React.Component {

  renderAuthor(authorData, index) {
    return <Author data={ authorData.data } rank={ index + 1 }/>
  }

  render() {
    return (
      <div className='authors'>
        { this.props.data.author_list.map(this.renderAuthor.bind(this)) }
      </div>
    )
  }
}

class Author extends React.Component {
  constructor(data) {
    super(data);

    let author = data.data.author;
    this.props.data.author = author.replace(new RegExp('^by\\s+', 'gi'), '');
  }

  getAuthorValues() {
    let data = this.props.data;
    let totalEngaged = data.total_engaged;
    let todaySeries = data.overview.data.today_series;
    let fbLikes = data.overview.data.facebook_likes;
    let tweets = data.overview.data.twitter_shares;

    return {
      totalEngaged,
      todaySeries,
      fbLikes,
      tweets
    }
  }

  render() {
    let data = this.getAuthorValues();
    return (
      <div className='author dashboard-item'>
        <div className='rank'>
          { this.props.rank }
        </div>
        <div className='series-data'>
          <DaySeries series={ data.todaySeries }/>
        </div>
        <div className='side-stats'>
          <DeltaValue value={ data.totalEngaged.num } rank={ this.props.rank } delta={ data.totalEngaged.delta }/>
          <SocialShares fbLikes={ data.fbLikes } tweets={ data.tweets} />
        </div>
        <div className='main-panel'>
          { toTitleCase(this.props.data.author) }
        </div>
      </div>
    )
  }
}