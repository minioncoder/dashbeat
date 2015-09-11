import React from 'react';
import numeral from 'numeral';

let TWITTER = 'twitter';
let FACEBOOK = 'facebook';

class SocialStat extends React.Component {

  renderSocialIcon() {
    let socialIcon = null;
    switch(this.type) {
      case TWITTER:
        socialIcon = (<i className='fa fa-twitter'></i>);
        break;
      case FACEBOOK:
        socialIcon = (<i className='fa fa-facebook'></i>);
        break;
    }
    if (!socialIcon) return socialIcon;

    return (
      <div className='social-icon'>
        { socialIcon }
      </div>
    )
  }

  render() {
    return (
      <div className='social-stat'>
        { this.renderSocialIcon() }
        <div className='stat-value'>{ this.props.data }</div>
      </div>
    )
  }
}

class TwitterStat extends SocialStat {
  constructor(args) {
    super(args);
    this.type = TWITTER;
  }
}

class FacebookStat extends SocialStat {
  constructor(args) {
    super(args);
    this.type = FACEBOOK;
  }
}

module.exports = {
  TwitterStat,
  FacebookStat
}
