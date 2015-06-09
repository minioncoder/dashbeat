import _each from 'lodash/collection/forEach';
import React from 'react';

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
  getDefaultProps() {
    return {
      hostName: '',
      overview: undefined,
      toppages: undefined,
      topauthors: undefined,
      topsections: undefined
    }
  }

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
  getDefaultProps() {
    return {
      data: undefined
    }
  }
  renderArticle(articleData, index) {
    return <Article notes={ articleData.notes } data={ articleData.data } madlibs={ articleData.madlibs } index={ index }/>
  }

  render() {
    return (
      <div className='articles'>
        { this.props.data.page_list.map(this.renderArticle) }
      </div>
    )
  }
}

class Article extends React.Component {
  getDefaultProps() {
    return {
      index: -1,
      notes: [],
      data: undefined,
      madlibs: []
    }
  }

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
    let maxHeight = 0.95;

    // Need to iterate over the series to find the highest value
    let maxValue = 0;
    _each(series, function(value) {
      if (value > maxValue) {
        maxValue = value;
      }
    });

    // Now iterate over the values again, this time assigning a width
    _each(series, function(value) {
      let height;
      if (value == maxValue) {
        height = maxHeight * 100;
      }
      else {
        height = (value / maxValue) * maxHeight * 100;
      }

      seriesData.push({
        width: pointWidth + '%',
        height: height + '%'
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
      <div className='point' style={ point }></div>
    )
  }

  render() {
    let stats = this.props.data.stats;

    let totalEngagedTime = parseInt(stats.total_engaged.num);
    let avgEngage = stats.engaged_time.toFixed(2);
    let fbLikes = stats.facebook_likes;
    let twitterShares = stats.twitter_shares;

    let series = this.generateSeries(stats.people_series);

    return (
      <div className='article'>
        <div className='series-data'>
          { series.map(this.renderSeries) }
        </div>
        <div className='side-stats'>
          <div className='total-engaged'>
            { totalEngagedTime } Minutes
          </div>
          <div className='avg-engaged'>
            { avgEngage } Seconds
          </div>
          <div className='social-shares'>
            <div className='fb-likes'>
              <i className="fa fa-facebook"></i>
              { fbLikes }
            </div>
            <div className='twitter-shares'>
              <i className="fa fa-twitter"></i>
              { twitterShares }
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

/* End React Components */
