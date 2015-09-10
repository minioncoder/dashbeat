'use strict';

import React from 'react';

import Ajax from '../lib/ajax';

async function getData(id) {
  let data;
  try {
    data = await Ajax("https://api.michigan.com/v1/article/" + id + "/");
  } catch (err) {
    throw err;
  }

  return {
    title: data.headline,
    subtitle: data.subheadline,
    photo: data.photo.full,
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
      open: false
    };

    render() {
      let rootClass = 'overview';
      if (!this.props.open) {
        rootClass += ' hidden';
      }

      if (!this.props.hasData) {
        return (
          <div className={ rootClass }></div>
        );
      }

      return (
        <div className={ rootClass }>
          <div className='articleClose' onClick={ this.props.close }><i className="fa fa-times-circle"></i></div>
          <img className='articlePhoto' src={ this.props.data.photo.url } />
          <div className='articleInfo'>
            <a target='_blank' href={ this.props.data.url }>{ this.props.data.title }</a>

            <div className='articleStats'>
              <div className='byline text-center'>{ this.props.data.authors }</div>
              <div className='date text-center'>{ this.props.data.timestamp }</div>
            </div>

            <div className='articleSummary'>
              { this.props.data.summary }
            </div>
          </div>

          <a href={ this.props.data.url } target='_blank'>See Full Article</a>
        </div>
      );
    };
}

module.exports = {
  getData,
  Overview
};

