'use strict';

import React from 'react';

import Ajax from '../lib/ajax';
import Config from '../../../config';

async function getData(id) {
  let data;
  try {
    data = await Ajax(Config.socketUrl + "/v1/article/" + id + "/");
  } catch (err) {
    throw err;
  }

  return {
    headline: data.headline,
    subheadline: data.subheadline,
    photo: data.photo.thumbnail,
    url: data.url,
    section: data.section,
    source: data.source,
    summary: data.summary,
    timestamp: data.timestamp
  };
};

class Overview extends React.Component {
  static defaultProps = {
    hasData: false,
    open: false,
    left: "100%"
  };

  render() {
    let rootClass = 'overview';

    if (!this.props.hasData) {
      return (
        <div className={ rootClass }></div>
      );
    }

    let summaryList = [];
    if (this.props.data.summary && this.props.data.summary.length > 0) {
      let summary = this.props.data.summary;
      for (let i = 0; i < summary.length; i++) {
        summaryList.push(<li key={i}>{ summary[i] }</li>);
      }
    }

    return (
      <div className={ rootClass } style={ {left: this.props.left} }>
        <div className='articleRow'>
          <div className='articleClose' onClick={ this.props.close }><i className="fa fa-times-circle"></i></div>
        </div>
        <div className='articleRow'>
          <a className='articleTitle' href={ this.props.data.url } target='_blank'>{ this.props.data.headline }</a>
        </div>

        <div className='articleRow'>
          <img className='articlePhoto' src={ this.props.data.photo.url } />
          <div className='articleStats'>
            <div className='byline text-center'>{ this.props.authors }</div>
            <div className='date text-center'>{ this.props.data.timestamp }</div>
          </div>
        </div>

        <div className='articleSummary'>
          <ul>{ summaryList }</ul>
          <a href={ this.props.data.url } target='_blank'>Read more ...</a>
        </div>
      </div>
    );
  };
}

module.exports = {
  getData,
  Overview
};

