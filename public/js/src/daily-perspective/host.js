import _each from 'lodash/collection/forEach';
import React from 'react';
import numeral from 'numeral';

export default class Host {
  constructor(hostName, data) {
    this.hostName = hostName;
    this.reactComponent = undefined;

    // These values are expected to be the first set of keys in the data Object
    this.expectedData = [
      'overview',
      'toppages',
      'topauthors',
      'topsections'
    ];

    this.compileData(data)
  }

  /**
   * Draws the dashbaord for this host to the DOM
   *
   * @memberof Host#
   */
  activate() {
    if (!this.data) return;

    this.reactComponent = React.render(
      <HostReact hostName={ this.hostName } overview={ this.overview } toppages={ this.toppages } topauthors={ this.topauthors } topsections={ this.topsections }/>,
      document.getElementById('dashboard')
    )
  }

  deactivate() {
    this.reactComponent = undefined;
  }

  updateData(data) {
    this.compileData(data)

    if (this.reactComonent) {
      this.reactComponent.setProps({
        data: this.data
      });
    }
  }

  /**
   * Parse the [data] response from the API call, breaking it into smaller,
   * more usable chunks
   *
   * @memberof Host#
   * @param {Object} [data] Object returned from an API call for the given host
   */
  compileData(data) {
    this.data = data;

    _each(this.expectedData, (key) => {
      if (!(key in this.data)) {
        throw new Error(`Expected key ${key} not found in data response. Unable to process data`);
      }
    });

    this.overview = data.overview;
    this.toppages = data.toppages;
    this.topauthors = data.topauthors;
    this.topsections = data.topsections;
  }
}

/* React Components */
class HostReact extends React.Component {

  render() {

    let className = `host-dashboard ${this.props.hostName}`;
    return(
      <div className={ className }>
        <div className='host-name'>{ this.props.hostName }</div>
        <div className='dashboard-content'>
          <div className='articles-container'>
            <Articles data={ this.props.toppages }/>
          </div>
        </div>
      </div>
    )
  }
}

class Articles extends React.Component {
  constructor() {
    this.props = {
      clickedArticle: undefined,
      data: {}
    }
  }

  articleClick(articleData) {
    return function() {
      console.log(`Clicked on ${articleData.data.title}`);
    }
  }

  renderArticle(articleData, index) {
    return function(articleData, index) {
      return <Article onClick={ this.articleClick(articleData) } notes={ articleData.notes } data={ articleData.data } madlibs={ articleData.madlibs } rank={ index + 1 }/>
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

class Article extends React.Component {
  componentWillMount() {
    this.props.data.path = 'http://' + this.props.data.path;
  }

  renderNotes(note, index) {
    return (
      <div className='note'>{ note }</div>
    )
  }

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
    let stats = this.props.data.stats;

    let totalEngagedTime = numeral(parseInt(stats.total_engaged.num)).format('0,0');
    let increase = (stats.total_engaged.delta >= 0.0) ? true : false;
    let engageDelta = (stats.total_engaged.delta * 100).toFixed(2);
    let avgEngage = stats.engaged_time.toFixed(2);
    let fbLikes = stats.facebook_likes;
    let twitterShares = stats.twitter_shares;

    let series = this.generateSeries(stats.people_series);

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

    return (
      <div className='article' onClick={ this.props.onClick }>
        <div className='rank'>
          { this.props.rank }
        </div>
        <div className='series-data'>
          { series.map(this.renderSeries) }
        </div>
        <div className='side-stats'>
          <div className='total-engage'>
            <div className={ engagedTimeClass } data-hint={ this.generateString(`Users spent a combined ${totalEngagedTime} minutes on this article. This is a ${engageDelta} change from the number ${this.props.rank} ranked article yesterday`) }>
              { totalEngagedTime } min
              <span className='delta'>
                <i className='fa fa-caret-down'></i>
                <i className='fa fa-caret-up'></i>
                { engageDelta }
              </span>
            </div>
          </div>
          <div className='avg-engaged'>
            <div className='value hint--bottom' data-hint={ this.generateString(`Users spent an averate of ${avgEngage} seconds on this article`) }>
              { avgEngage } sec
            </div>
          </div>
          <div className='social-shares'>
            <div className='fb-likes hint--bottom' data-hint={ this.generateString(`This article was liked ${fbLikes} times on Facebook`) }>
              <i className='fa fa-facebook'></i>
              <span className='value'>{ fbLikes }</span>
            </div>
            <div className='twitter-shares hint--bottom' data-hint={ this.generateString(`This article was shared ${twitterShares} times on Twitter`) }>
              <i className='fa fa-twitter'></i>
              <span className='value'>{ twitterShares }</span>
            </div>
          </div>
        </div>
        <div className='main-panel'>
          <div className='title'>
            <a href={ this.props.data.path }>{ this.props.data.title }</a>
          </div>
          <div className='top-referrers'>

          </div>
        </div>
      </div>
    )
  }
}

class ArticleSummary extends React.Component {

  render() {

  }
}

/* End React Components */
