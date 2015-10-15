/**
 * Module used to render Article-based information for the Daily Perspective
 * dashboard.
 */
import _each from 'lodash/collection/forEach';
import _keys from 'lodash/object/keys';
import React from 'react';
import ReactDOM from 'react-dom';
import { parseReferrer, generateString } from 'publicLib/parse';
import PieChart from 'charts/piechart';
import { DeltaValue, DaySeries, SocialShares } from './common';

export default class Articles extends React.Component {
  constructor() {
    super();

    this.props = {
      clickedArticle: undefined,
      data: {},
      summary: undefined
    };
  }

  articleClick() {

    this.props.summary = ReactDOM.render(
      // According to React documentation, there's no .setProps when you're extending
      // React.Componnent. JS warning says to call .render again from the top
      // level
      <ArticleSummary article={ this }/>,
      document.getElementById('article-summary')
    )

    this.props.summary.setState({
      closed: false
    })
  }

  renderArticle(articleData, index) {
    return <Article onClick={ this.articleClick } notes={ articleData.notes } data={ articleData.data } madlibs={ articleData.madlibs } rank={ index + 1 }/>
  }

  render() {
    return (
      <div className='articles'>
        { this.props.data.page_list.map(this.renderArticle.bind(this)) }
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

    let totalEngagedTime = parseInt(stats.total_engaged.num);
    let increase = (stats.total_engaged.delta >= 0.0) ? true : false;
    let engageDelta = (stats.total_engaged.delta * 100).toFixed(2);
    let avgEngage = stats.engaged_time ? stats.engaged_time.toFixed(2) : 0.0;
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
      <div className='article dashboard-item' onClick={ this.props.onClick.bind(this) }>
        <div className='rank'>
          { data.rank }
        </div>
        <div className='series-data'>
          <DaySeries series={ data.people_series }/>
        </div>
        <div className='side-stats'>
          <DeltaValue value={ data.totalEngagedTime } delta={ this.engagedDelta} rank={ data.rank }/>
          <div className='avg-engaged'>
            <div className='value hint--bottom' data-hint={ generateString(`Users spent an averate of ${data.avgEngage} seconds on this article`) }>
              { data.avgEngage } sec
            </div>
          </div>
          <SocialShares fbLikes={ data.fbLikes } tweets={ data.tweets }/>
        </div>
        <div className='main-panel'>
          <span className='title'>
            { data.title }
          </span>
          <div className='top-referrers'>

          </div>
        </div>
      </div>
    )
  }
}
/* End Article */

class ArticleSummary extends React.Component {
  constructor(args) {
    super(args);

    this.props = args;
    this.props.data = this.props.article.getArticleData();

    // open the summary by default
    this.state = {
      closed: false
    }

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
    if (this.state.closed) return;

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

  closeSummary() {
    this.setState({
      closed: true
    });
  }

  render() {
    if (!('data' in this.props)) {
      this.props.data = this.props.article.getArticleData();
    }
    let data = this.props.data;

    let summaryClass = 'article-summary';
    if (this.state.closed) {
      document.body.classList.remove('summary-open');
      return null;
      summaryClass += ' closed';
    }
    else {
      document.body.classList.add('summary-open');
    }

    return (
      <div className={ summaryClass }>
        <div className='overlay' onClick={ this.closeSummary.bind(this) }></div>
        <div className='article-summary-container'>
          <div className='title'>
            { data.title }
          </div>
          <div className='notes'>
            { data.notes.map(this.renderNotes) }
          </div>
          <div className='summary'>
            <div className='engagement'>
              <DeltaValue value={ data.totalEngagedTime } delta={ this.engagedDelta} rank={ data.rank }/>
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
            <DaySeries series={ data.people_series } />
          </div>
        </div>
      </div>
    )
  }
}