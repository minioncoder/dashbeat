
import _each from 'lodash/collection/forEach';

import React from 'react';


var ReferrerReact = React.createClass({
  getDefaultProps() {
    return {
      // hosts: {}, // For some reason, they resuse this object across all classes,
                    // which causes a lot of problems, especially when a default property
                    // is an object (objects are pass by reference)
      name: '',
      hide: true,
      parent: undefined
    }
  },

  hide() {
    console.log(`Hiding ${this.props.name}`);
  },

  render() {
    var className = this.props.name;
    if (this.props.hide) {
      className += ' hidden';
    }
    return (
      <div className={ className }>
        { this.props.name }: { this.getTotal() }
      </div>
    )
  }
});

/**
 * Referrer - Individual referring host. E.g. t.co, google.com, facebook.com, etc
 *
 * @class
 */
class Referrer {
  /**
   * @constructs
   * @param {String} [name] Name of the referring site (e.g. t.co, google.com)
   */
  constructor(name='') {
    this.hosts = {}; // Maps hosts to totals (e.g { detnews.com: 11 })
    this.name = name; // Name of referring site
    this.hide = true; // Whether or not to draw the referral
    this.rank; // Referrer rank. 1-15, 1 being most referred
    this.percentage; // Percentage of total referrals that this referrer is
                     // Used to calculate the size of the circle
    this.react; // ReferrerReact class
  }

  /**
   * Add a host to this referrer. E.g. detroitnews.com, freep.com
   *
   * @memberof Referrer#
   * @param {String} [host] URL of a news site (e.g. freep.com)
   * @param {Number} [value] The number of referrals to the [host] site from this Referrer
   */
  addHost(host, value) {
    this.hosts[host] = value;
  }

  /**
   * Adds up the total number of referrers for all sites in this.hosts
   * @memberof Referrer#
   * @return {Number} Total number of referrals for all sites for this Referral
   */
  getTotal() {
    let total = 0;
    _each(this.hosts, function(val) { total += val; });

    return total;
  }

  draw() {
    this.hide = false;

    if (!this.react) {
      this.react = React.render(
        <ReferrerReact name={ this.name } parent= { this }/>,
        document.getElementById(this.name)
      )
    }
  }

  hide() {
    this.hide = true;

    if (!this.react) return;

    this.react.hide();
  }
}

module.exports = function(name) {
  return new Referrer(name);
}