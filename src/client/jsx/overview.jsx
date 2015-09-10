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
      open: false,
      data: {
        url: "",
        visits: 0,
        authors: "",
        title: "",
        subtitle: "",
        source: "",
        timestamp: "",
        section: "",
        summary: "",
        photo: {
          url: "",
          height: 0,
          width: 0
        }
      }
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
          <div className='close-summary' onClick={ this.props.close }><i className="fa fa-times-circle"></i></div>
          <div className='article-info'>
            <div className='article-image text-center'>
              <img src={ this.props.data.photo.url } style={ {width: "100%", height: "auto"} } />
            </div>
            <div className='title text-center'><a target='_blank' href={ this.props.data.url }>{ this.props.data.title }</a></div>
            <div className='article-stats'>
              <div className='byline text-center'>{ this.props.data.authors }</div>
              <div className='readers text-center'>Readers: { this.props.visits }</div>
              <div className='date text-center'>{ this.props.data.timestamp }</div>
            </div>
            <div className='summary-container'>
              <div className='summary'>
                  { this.props.data.summary }
              </div>
              <div className='overflow-shadow'></div>
            </div>
            <div className='button-container center'>
              <a target='_blank' href={ this.props.data.url } className='button primary center'>See Full Article</a>
            </div>
          </div>
        </div>
      );
    };
}

module.exports = {
  getData,
  Overview
};

