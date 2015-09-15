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

    let summary = this.props.data.summary;;
    if (this.props.data.summary && this.props.data.summary.length > 0 && typeof this.props.data.summary != "string") {
      summary = this.props.data.summary.join("  ");
    }

    return (
      <div className={ rootClass } style={ {left: this.props.left} }>
        <div className='articleClose' onClick={ this.props.close }><i className="fa fa-times-circle"></i></div>
        <a className='articleTitle' href={ this.props.data.url } target='_blank'>{ this.props.data.title }</a>

        <img className='articlePhoto' src={ this.props.data.photo.url } />

        <div className='articleStats'>
          <div className='byline text-center'>{ this.props.authors }</div>
          <div className='date text-center'>{ this.props.data.timestamp }</div>
        </div>

        <div className='articleSummary'>
          <p>{ summary }</p>
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
