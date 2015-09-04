'use strict';

import React from 'react';

import Ajax from '../lib/ajax';

async function getData(id) {
  try {
    data = await Ajax("https://api.michigan.com/article/" + id + "/");
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
    state = {
      open: false,
      hasData: false,
    };

    static defaultProps = {
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
      let rootClass = '';
      if (!this.props.open)
        rootClass = 'hidden';

      console.log(this.props.data);
      return (
        <div className={ rootClass }>
          <div className='close-summary' onClick={ this.closeOverview }><i className="fa fa-times-circle"></i></div>
          <div className='article-info'>
            <div className='article-image text-center'>
              <img src={ this.props.data.photo.url } style={ {width: "100%", height: this.props.data.photo.height  + "px" } } />
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
          <div className='article-loading'>
            <div>Loading article...</div>
            <i className='fa fa-spinner fa-spin'></i>
          </div>
        </div>
      );
    };

    closeOverview() {
      this.state.open = false;
    };

    slideIn() {
      var parent = this.getDOMNode().parentNode;
      var windowWidth = window.innerWidth;
      var left = windowWidth >= 768 ? '50%' : '0%';
      var that = this;

      Velocity(parent, { left: left }, {
        // easing: EASING,
      });

      $('.page-overlay')
        .css({ display: 'block' })
        .on('click', function() {
            that.closeSummary();
        });
    };

    slideOut() {
      var parent = this.getDOMNode().parentNode;
      var that = this;
      Velocity(parent, { left: '102%' }, {
        // easing: EASING,
        complete: function() {
          that.setState({ loading: true });
          that.setProps(DEFAULT_PROPS);
        }
      });

      $('.page-overlay').css({ display: 'none' });
      $('.page-overlay').off('click');
    };
}

module.exports = {
  getData,
  Overview
};

