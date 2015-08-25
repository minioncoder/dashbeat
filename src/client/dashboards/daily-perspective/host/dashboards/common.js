import _each from 'lodash/collection/forEach';
import React from 'react';
import numeral from 'numeral';
import { generateString } from 'publicLib/parse';

class DeltaValue extends React.Component {
  /**
   * Really just here for the comments
   *
   * @constructs
   * @param {Object} [data] Data passed to react object:
   *                  {
   *                    value: {Number} value from today,
   *                    rank: {Number} rank of article/author/etc
   *                    delta: {Number} percentage change
   *                  }
   */
  constructor(data) {
    super(data);
  }

  render() {
    let data = this.props;

    let className = 'value'
    if (this.props.delta > 0) className += ' up';
    else className += ' down';

    return (
      <div className='total-engage'>
        <div className={ className } data-hint={ generateString(`Users spent a combined ${data.value} minutes on this article. This is a ${data.delta} change from the number ${data.rank} ranked article yesterday`) }>
          { numeral(data.value).format('0,0') } min
          <span className='delta'>
            <i className='fa fa-caret-down'></i>
            <i className='fa fa-caret-up'></i>
          </span>
        </div>
      </div>
    )
  }
}

class DaySeries extends React.Component {
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

  render() {
    return (
      <div className='social-shares'>
        <div className='fb-likes' data-hint={ generateString(`This article was liked ${this.props.fbLikes} times on Facebook`) }>
          <i className='fa fa-facebook'></i>
          <span className='value'>{ this.props.fbLikes }</span>
        </div>
        <div className='twitter-shares' data-hint={ generateString(`This article was shared ${this.props.tweets} times on Twitter`) }>
          <i className='fa fa-twitter'></i>
          <span className='value'>{ this.props.tweets }</span>
        </div>
      </div>
    )
  }
}

module.exports = {
  DeltaValue,
  DaySeries,
  SocialShares
}