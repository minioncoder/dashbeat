import $ from 'domtastic';
import _each from 'lodash/collection/forEach';
import React from 'react';
import request from 'request';
import Velocity from 'velocity-animate';
import moment from 'moment';

import { parse } from '../lib/index';

// JSX
import ReactNumberEasing from 'react-number-easing';

var EASING = [0.680, -0.550, 0.265, 1.550];
var DEFAULT_PROPS = {
  imageUrl: '',
  articleTitle: '',
  articleSummary: '',
  title: '',
  url: '',
  article: undefined,
  byline: '',
  date: ''
};

var ArticleSummary = React.createClass({
  getDefaultProps() {
    return DEFAULT_PROPS;
  },
  getArticleBody(article) {
    var bodyHtml = '';
    _each(article.body, function(element) {
      if(!('type' in element) || element.type !== 'text') return;

      bodyHtml += element.value;
    });

    return bodyHtml;
  },

  /**
   * Parses a /json url for a Gannett article. Sets the associated stuff in
   * this.props
   *
   * @param {Object} json - JSON response from <articleUrl>/json HTTP call
   */
  parseArticle(json) {
    var article = json.article;
    var props = {};

    // Get a picture to use
    if ('lead_photo' in article) {
      var cdnBase = article.lead_photo.asset_metadata.items.publishurl;
      var path = article.lead_photo.asset_metadata.items.basename;

      props.imageUrl = cdnBase + path;
    }

    // Get the article title
    if ('metadata' in article) {
      props.articleTitle = article.metadata.headline;
      props.byline = article.metadata.byline;
      props.date = moment(article.metadata.dates.lastupdated).format('Do MMMM YYYY, h:mm:ss a');
    }

    props.articleSummary = this.getArticleBody(article);

    this.setProps(props);

    this.setState({ loading: false });
  },
  fetchInfo() {
    var url = this.props.url + 'json';
    var that = this;

    if (url in this.articleCache) {
      this.parseArticle(this.articleCache[url]);
      return;
    }

    request({
      baseUrl: document.location.origin,
      url: '/get-article/',
      qs: {
        url: url
      }
    },
    function(error, response, body) {
      if (error) throw Error(error);

      try {
        body = JSON.parse(body);
      }
      catch(e) {
        throw new Error(e);
      }

      if (!('article' in body)) {
        console.log('No article element in body, returning');
        return;
      }

      that.articleCache[url] = body;
      that.parseArticle(body);
    });
  },
  slideIn() {
    var parent = this.getDOMNode().parentNode;
    var windowWidth = window.innerWidth;
    var left = windowWidth >= 768 ? '50%' : '0%';
    var that = this;

    Velocity(parent, { left: left }, {
      // easing: EASING,
    });

    $('.page-overlay').css({ display: 'block' })
      .on('click', function() {
        that.closeSummary();
      });
  },
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

    $('.page-overlay').css({ display: 'none' })
      .off('click');
  },
  closeSummary() {
    this.slideOut();

    if (this.props.article) {
      this.props.article.setProps({ summary: undefined });
    }
  },
  openSummary() {

    this.slideIn();
    this.fetchInfo();
  },
  componentWillMount() {
    this.setState({ loading: true });

    this.articleCache = {};
  },
  componentDidUpdate(prevProps, prevState) {
    // Only open the summary if we've received a new URL
    if (!prevProps.url && !!this.props.url) {
      this.openSummary();
    }
  },
  render() {
    // For loading/loaded state
    var summaryClass = 'article-summary ';
    if (this.state.loading) {
      summaryClass += 'loading';
    }
    else {
      summaryClass += 'loaded';
    }

    // In case the article doesn't have a picture
    var imgClass = '';
    if (!this.props.imageUrl) {
      imgClass += 'hidden';
    }

    // TODO revisit this - it probably means i can do this a bit better
    var readersElement;
    if (this.props.article) {
      readersElement = <ReactNumberEasing value={ this.props.article.props.readers }/>
    }
    else {
      readersElement = '';
    }

    return (
      <div className={ summaryClass }>
        <div className='close-summary' onClick={ this.closeSummary }><i className="fa fa-times-circle"></i></div>
        <div className='article-info'>
          <div className='article-image text-center'>
            <img className={ imgClass } src={ this.props.imageUrl }/>
          </div>
          <div className='title text-center'><a target='_blank' href={ this.props.url }>{ this.props.title }</a></div>
          <div className='article-stats'>
            <div className='byline text-center'>{ this.props.byline }</div>
            <div className='readers text-center'>Readers: { readersElement }</div>
            <div className='date text-center'>{ this.props.date }</div>
          </div>
          <div className='summary-container'>
            <div className='summary' dangerouslySetInnerHTML={{__html: this.props.articleSummary }}></div>
            <div className='overflow-shadow'></div>
          </div>
          <div className='button-container center'>
            <a target='_blank' href={ this.props.url } className='button primary center'>See Full Article</a>
          </div>
        </div>
        <div className='article-loading'>
          <div>Loading article...</div>
          <i className='fa fa-spinner fa-spin'></i>
        </div>
      </div>
    )
  }
});

module.exports = function(data, id) {
  return React.render(
    <ArticleSummary/>,
    document.getElementById(id)
  )
}