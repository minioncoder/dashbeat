/**
 * Module used to render Article-based information for the Daily Perspective
 * dashboard.
 */
import _each from 'lodash/collection/forEach';
import _keys from 'lodash/object/keys';
import React from 'react';
import numeral from 'numeral';
import { parseReferrer } from '../../../lib/parse';
import PieChart from '../../../charts/piechart';

export default class Articles extends React.Component {
  constructor() {
    super();

    this.props = {
      clickedArticle: undefined,
      data: {}
    };
  }

  articleClick() {
    var closeSummary = function() {
      React.render(
        <ArticleSummary article={ this } closed={ true }/>,
        document.getElementById('article-summary')
      )
    }

    React.render(
      // According to React documentation, there's no .setProps when you're extending
      // React.Componnent. JS warning says to call .render again from the top
      // level
      <ArticleSummary article={ this } closeSummary={ closeSummary.bind(this) }/>,
      document.getElementById('article-summary')
    )
  }

  renderArticle(articleData, index) {
    return function(articleData, index) {
      return <Article onClick={ this.articleClick } notes={ articleData.notes } data={ articleData.data } madlibs={ articleData.madlibs } rank={ index + 1 }/>
    }
  }

  render() {
    return (
      <div className='articles'>
        { this.props.data.page_list.map(this.renderArticle().bind(this)) }
      </div>
    )
  }
}

/* Article */
class Article extends React.Component {
  componentWillMount() {
    this.props.data.path = 'http://' + this.props.data.path;
  }

  /**
   * Because of JSX parsing, it doesn't look like you can put ES6 string templates
   * in HTML attributes. This is a simple wrapper which allows you to do so
   *
   * @memberof Article#
   * @param {String} [string] String to be generated
   * @return {String} returns [string] argument
   */
  generateString(string) {
    return string;
  }

  /**
   * Parse a list of referrers, getting a list of distince, readabel names
   * (e.g. t.co -> Twitter)
   *
   * @memberof Article#
   * @param {Array} [refs] Array of referrers from /report_api/ Charbeat call.
   *    [refs][n][0] holds the referral name
   * @return {Array} Return a list of distinct, parsed referral names,
   *    ordered by most-referred
   */
  parseReferrers(refs) {
    let referrals = {};
    _each(refs, function(ref) {
      referrals[parseReferrer(ref[0])] = true;
    });

    return _keys(referrals);
  }

  getArticleData() {
    let stats = this.props.data.stats;

    let totalEngagedTime = numeral(parseInt(stats.total_engaged.num)).format('0,0');
    let increase = (stats.total_engaged.delta >= 0.0) ? true : false;
    let engageDelta = (stats.total_engaged.delta * 100).toFixed(2);
    let avgEngage = stats.engaged_time.toFixed(2);
    let fbLikes = stats.facebook_likes;
    let tweets = stats.twitter_shares;

    let engagedTimeClass = 'value hint--bottom';
    if (increase) {
      engagedTimeClass += ' up';
    }
    else {
      engagedTimeClass += ' down';
    }

    if (engageDelta >=  0.0) {
      engageDelta = '+' + engageDelta;
    }

    engageDelta += '%';

    return {
      // Article info
      path: this.props.data.path,
      title: this.props.data.title,

      // Article stats
      rank: this.props.rank,
      people_series: stats.people_series,
      engagedTimeClass,
      engageDelta,
      totalEngagedTime,
      avgEngage,
      fbLikes,
      tweets,
      notes: this.props.notes,
      topRefs: this.parseReferrers(stats.toprefs),

      // Percentages for pie chart
      percentages: {
        // Internal: stats.internal_pct,
        Links: stats.links_pct,
        Social: stats.social_pct,
        Search: stats.search_pct
      }
    }
  }

  render() {
    let data = this.getArticleData();

    return (
      <div className='article' onClick={ this.props.onClick.bind(this) }>
        <div className='rank'>
          { data.rank }
        </div>
        <div className='series-data'>
          <ArticleSeries series={ data.people_series }/>
        </div>
        <div className='side-stats'>
          <div className='total-engage'>
            <div className={ data.engagedTimeClass } data-hint={ this.generateString(`Users spent a combined ${data.totalEngagedTime} minutes on this article. This is a ${data.engageDelta} change from the number ${data.rank} ranked article yesterday`) }>
              { data.totalEngagedTime } min
              <span className='delta'>
                <i className='fa fa-caret-down'></i>
                <i className='fa fa-caret-up'></i>
              </span>
            </div>
          </div>
          <div className='avg-engaged'>
            <div className='value hint--bottom' data-hint={ this.generateString(`Users spent an averate of ${data.avgEngage} seconds on this article`) }>
              { data.avgEngage } sec
            </div>
          </div>
          <SocialShares fbLikes={ data.fbLikes } tweets={ data.tweets }/>
        </div>
        <div className='main-panel'>
          <div className='title'>
            <a href={ data.path }>{ data.title }</a>
          </div>
          <div className='top-referrers'>

          </div>
        </div>
      </div>
    )
  }
}

/* Article Components */

class ArticleSeries extends React.Component {
  /**
   * Given an array of concurrent readers, generate HTML for a graph depicting
   * the series data over the course of a day.
   *
   * @memberof Article#
   * @param {Array} [series] Values of concurrent readers during the course of a day
   * @returns {Array} Array of values with 'width' and 'height' propeties, which will
   *                  determine their width and height in the DOM
   */
  generateSeries(series) {
    let seriesData = [];
    let pointWidth = series.length > 100 ? (100 / series.length) : (series.length / 100);
    let maxHeight = 0.90;

    // Need to iterate over the series to find the highest value
    let maxValue = 0;
    _each(series, function(value) {
      if (value > maxValue) {
        maxValue = value;
      }
    });

    // Now iterate over the values again, this time assigning a width
    _each(series, function(value, index) {
      let height;
      if (value == maxValue) {
        height = maxHeight * 100;
      }
      else {
        height = (value / maxValue) * maxHeight * 100;
      }

      seriesData.push({
        width: pointWidth + '%',
        height: height + '%',
        bottom: 0,
        left: (pointWidth * index) + '%'
      });
    });

    return seriesData;
  }

  /**
   * Generate the HTML for a series point created by this.generateSeries()
   *
   * @memberof Article#
   * @param {Object} [point] Object with 'width' and 'height' properties to determine
   *                          CSS height and width
   * @param {Number} [index] Array index for the given [point]
   */
  renderSeries(point, index) {
    return (
      <div className='point' id={index} style={ point }></div>
    )
  }

  render() {
    let series = this.generateSeries(this.props.series);
    return (
      <div className='series-data'>
        { series.map(this.renderSeries) }
      </div>
    )
  }
}

class SocialShares extends React.Component {
  /**
   * Because of JSX parsing, it doesn't look like you can put ES6 string templates
   * in HTML attributes. This is a simple wrapper which allows you to do so
   *
   * @memberof Article#
   * @param {String} [string] String to be generated
   * @return {String} returns [string] argument
   */
  generateString(string) {
    return string;
  }

  render() {
    return (
      <div className='social-shares'>
        <div className='fb-likes hint--bottom' data-hint={ this.generateString(`This article was liked ${this.props.fbLikes} times on Facebook`) }>
          <i className='fa fa-facebook'></i>
          <span className='value'>{ this.props.fbLikes }</span>
        </div>
        <div className='twitter-shares hint--bottom' data-hint={ this.generateString(`This article was shared ${this.props.tweets} times on Twitter`) }>
          <i className='fa fa-twitter'></i>
          <span className='value'>{ this.props.tweets }</span>
        </div>
      </div>
    )
  }
}

/* End Article Components */

/* End Article */

class ArticleSummary extends React.Component {
  constructor(args) {
    super(args);

    this.props = args;
    this.props.data = this.props.article.getArticleData();

    // open the summary by default
    if (!('closed' in this.props)) this.props.closed = false;

    this.pieChart = undefined;
  }

  renderNotes(note, index) {
    return (
      <div className='note'>{ note }</div>
    )
  }

  renderTopRefs(ref, index) {

    return (
      <div className='referral'>{ ref }</div>
    )
  }

  drawPieChart() {
    if (this.props.closed) return;

    let data = [];
    _each(this.props.data.percentages, function(value, key) {
      data.push({
        label: key,
        value,
      })
    });


    this.pieChart = new PieChart(data, document.getElementById('percentages'));
  }

  componentDidMount() {
    this.drawPieChart();
  }

  componentDidUpdate() {
    this.drawPieChart();
  }

  render() {
    if (!('data' in this.props)) {
      this.props.data = this.props.article.getArticleData();
    }
    let data = this.props.data;

    let summaryClass = 'article-summary';
    if (this.props.closed) {
      summaryClass += ' closed';
    }

    return (
      <div className={ summaryClass }>
        <div className='overlay' onClick={ this.props.closeSummary }></div>
        <div className='article-summary-container'>
          <div className='title'>
            { data.title }
          </div>
          <div className='notes'>
            { data.notes.map(this.renderNotes) }
          </div>
          <div className='summary'>
            <div className='engagement'>
              <div className='total-engage'>{ data.totalEngagedTime }</div>
              <div className='engage-avg'>{ data.avgEngage }</div>
            </div>
            <div className='referrals'>
              <SocialShares fbLikes={ data.fbLikes } tweets={ data.tweets }/>
              <div className='referral-list'>
                { data.topRefs.map(this.renderTopRefs) }
              </div>
            </div>
          </div>
          <div className='pie-chart' id='percentages'>
          </div>
          <div className='series'>
            <ArticleSeries series={ data.people_series } />
          </div>
        </div>
      </div>
    )
  }
}