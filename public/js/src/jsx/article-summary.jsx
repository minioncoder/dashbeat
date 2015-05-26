import $ from 'domtastic';
import { each } from 'lodash';
import React from 'react';
import request from 'request';
import Velocity from 'velocity-animate';
import { parse } from '../lib/index';
import Summary from 'node-summary';

var EASING = [0.680, -0.550, 0.265, 1.550];
var DEFAULT_PROPS = {
  imageUrl: '',
  articleTitle: '',
  articleSummary: '',
  loading: true,
  title: '',
  url: ''
};

var ArticleSummary = React.createClass({
  getDefaultProps() {
    return DEFAULT_PROPS;
  },
  getArticleBody(article) {
    var bodyHtml = '';
    each(article.body, function(element) {
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

    $(window).on('resize', function() {
      var windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        Velocity(that.getDOMNode().parent, {
          left: '0%'
        });
      }
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

    $(window).off('resize');
  },
  closeSummary() {
    this.slideOut();
  },
  openSummary(props) {
    this.props.url = props.url;
    this.props.title = props.title;

    this.slideIn();
    this.fetchInfo();
  },
  componentWillMount() {
    this.setState({ loading: true });

    this.articleCache = {};
  },
  render() {
    var summaryClass = 'article-summary ';
    if (this.state.loading) {
      summaryClass += 'loading';
    }
    else {
      summaryClass += 'loaded';
    }

    var imgClass = '';
    if (!this.props.imageUrl) {
      imgClass += 'hidden';
    }

    return (
      <div className={ summaryClass }>
        <div className='close-summary' onClick={ this.closeSummary }><i className="fa fa-times-circle"></i></div>
        <div className='article-info'>
          <div className='article-image text-center'>
            <img className={ imgClass } src={ this.props.imageUrl }/>
          </div>
          <div className='title text-center'><a target='_blank' href={ this.props.url }>{ this.props.title }</a></div>
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
    <ArticleSummary title={ data.title } url={ data.url }/>,
    document.getElementById(id)
  )
}