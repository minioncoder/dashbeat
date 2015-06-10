/**
 * Module used to render the Daily Perspective of a given host
 */

import _each from 'lodash/collection/forEach';
import React from 'react';
import Articles from './articles';

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
/* End React Components */
