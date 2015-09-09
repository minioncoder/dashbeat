import _each from 'lodash/collection/forEach';
import request from 'request';
import React from 'react';
import moment from 'moment';
import assign from 'object-assign';

import $ from 'framework/$';
import DashboardControl from './obj/dashboardControl';
import { dashboardStore } from './store';

class Dashboard extends React.Component {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.hosts = {};
    this.activeHost = undefined;

    this.state = {
      doneFetching: false
    }

    this.state = assign({}, this.state, dashboardStore.getState());

    dashboardStore.addChangeListener(this.stateChange.bind(this));
  }

  stateChange() {
    this.setState(dashboardStore.getState());
  }

  compnent

  /**
   * Makes an AJAX call to the server to get the daily report data
   *
   * @memberof Dashboard#
   * @param {Date} [date] Date requested, default=undefined
   */
  fetchData(date=undefined) {
    this.setState({
      doneFetching: false
    });

    if (typeof date != 'undefined') {
      this.currentDay = moment(date);
    }

    request({
      baseUrl: document.location.origin,
      url: '/get-daily-perspective/',
      qs: {
        date
      }
    },
    (error, response, body) => {
      if (error) throw Error(error);
      let parsed;

      try {
        parsed = JSON.parse(body);
      }
      catch(e) {
        throw new Error(e);
      }

      this.updateData(parsed);

      this.setState({
        doneFetching: true
      })
    })
  }

  /**
   * Handle the response from the 'reports' socket. Iterate over all the hosts
   * and collect the data, passing it to each Host object
   *
   * @memberof Dashboard#
   * @param {Object} [data] Object maping host names to return API data
   */
  updateData(data) {
    _each(data, (stats, hostName) => {
      this.compileHostData(hostName, stats);
    });

    if (!this.activeHost) {
      this.activeHost = 'freep.com';
    }
  }

  /**
   * When the host selector dropdown changes host, set the active host
   *
   * @memberof Dashboard#
   * @param {String} [hostName] Name of host, whose data will be displayed
   */
  hostChange(hostName) {
    if (!(hostName in this.hosts)) return;

    this.activeHost = hostName;
    console.log(`New host change: ${this.activeHost}`);

    this.setState({
      hostChange: true
    });
  }

  /**
   * When the date selector changes, re-fetch the data
   *
   * @memberof Dashboard#
   * @param {Object} [date] Moment date object
   */
  dateChange(date) {
    this.fetchData(date.format('YYYY-MM-DD'));
  }

  /**
   * Creates a Host object with the name @param host in this.hosts
   *
   * @memberof Dashboard#
   * @param {String} [hostName] Name of host (e.g. freep.com)
   * @param {Object} [stats] Response data from API call for the given [hostName]
   *
   */
  compileHostData(hostName, stats) {
    this.hosts[hostName] = {
      name: hostName,
      overview: stats.overview,
      toppages: stats.toppages,
      topauthors: stats.topauthors,
      topsections: stats.topsections
    }
  }

  generateDashboard() {
    if (!this.activeHost) {
      return '';
    }

    let host = this.hosts[this.activeHost];
    return null;
  }

  render() {

    if (!('state' in this) || !this.state.doneFetching) {
      return (
        <div className='dashboard-container'>
          <div className='initializing'>
            Loading data...
          </div>
        </div>
      )
    }
    else {
      return (
        <div className='dashboard-container'>
          <DashboardControl currentDay={ this.state.date }/>
          { this.generateDashboard() }
        </div>
      )
    }
  }
}

module.exports = function() {
  return React.render(
    <Dashboard/>,
    document.getElementById('dashboard')
  )
}
