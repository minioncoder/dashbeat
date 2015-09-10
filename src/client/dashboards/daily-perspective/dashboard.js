import _each from 'lodash/collection/forEach';
import request from 'request';
import React from 'react';
import moment from 'moment';
import assign from 'object-assign';

import $ from 'framework/$';
import DashboardControl from './obj/dashboardControl';
import Host from './obj/host';
import { dashboardStore } from './store';
import { DATEFORMAT } from './store/dashboardStore';

let hostNames = {
  'freep.com': 'Free Press',
  'detroitnews.com': 'Detroit News',
  'battlecreekenquirer.com': 'Battle Creek Enquirer',
  'hometownlife.com': 'Hometown Life',
  'lansingstatejournal.com': 'Lansing State Journal',
  'livingstondaily.com': 'Livingston Daily',
  'thetimesherald.com': 'The Times Herald'
}

class Dashboard extends React.Component {
  /**
   * @constructs
   */
  constructor() {
    super();

    this.hosts = {};

    this.state = {
      doneFetching: true
    }

    this.state = assign({}, this.state, dashboardStore.getState());

    dashboardStore.addChangeListener(this.stateChange.bind(this));
  }

  stateChange() {
    // Don't change the state if we're in the middle of fetching
    if (!this.state.doneFetching) return;
    this.setState(dashboardStore.getState());
  }

  componentWillUpdate(nextProps, nextState) {
    if (!dashboardStore.sameDates(this.state.date, nextState.date)) {
      this.fetchData(nextState.date);
    }
  }

  /**
   * Makes an AJAX call to the server to get the daily report data
   *
   * @memberof Dashboard#
   * @param {Date} [date] Date requested, default=undefined
   */
  fetchData(date=this.state.date) {
    this.setState({
      doneFetching: false
    });
    console.log('fetching data');

    request({
      baseUrl: document.location.origin,
      url: '/get-daily-perspective/',
      qs: {
        date: date.format(DATEFORMAT)
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
      console.log(parsed);

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

  renderDashboard() {
    let hosts = [];
    for (var host in this.hosts) {
      hosts.push(
        <Host host={ host }
          name={ host in hostNames ? hostNames[host] : host }
          data={ this.hosts[host] }
          activeOption={ this.state.activeOption }/>
      )
    }
    return (
      <div className='hosts'>
        { hosts }
      </div>
    );
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
          <DashboardControl currentDay={ this.state.date }
              availableOptions={ dashboardStore.getDashboardOptions() }
              activeOption={ this.state.activeOption}/>
          { this.renderDashboard() }
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
