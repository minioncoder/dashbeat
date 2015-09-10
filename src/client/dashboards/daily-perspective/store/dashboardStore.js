import { EventEmitter } from 'events';

import assign from 'object-assign';
import moment from 'moment';

import { DATECHANGE, CHANGEEVENT, OPTIONCHANGE } from '../action/dashboardAction';
import Dispatcher from '../dispatcher';

let DATEFORMAT = 'YYYY-MM-DD';

/** Dashboard options. Defines what a user can see per market at a given time */
let QUICKSTATS = 'quick-stats';
let TOTALSTORIES = 'total-stories';
let TOTALMINUTES = 'total-minutes';
let PEAKCONCURRENT = 'peak-concurrent';
let TOPSTORIES = 'top-stories';
let TOPAUTHORS = 'top-authors';
let dashboardOptions = [ QUICKSTATS, TOTALSTORIES, TOTALMINUTES, PEAKCONCURRENT,
    TOPSTORIES, TOPAUTHORS];
let dashboardState = {
  // Initialize the date to yesterday
  date: moment().subtract(1, 'days'),
  activeOption: dashboardOptions[0]
}

let dashboardStore = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGEEVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGEEVENT, callback);
  },

  getState() { return dashboardState },

  getDashboardOptions() { return dashboardOptions; },

  /**
   * Compare two moment date objects, formatting them as YYYY-MM-DD and testing
   * equality
   *
   * @memberof dashboardStore
   * @param {Object} date1 - Moment date object
   * @param {Object} date2 - Moment date object
   *
   */
  sameDates(date1, date2) {
    return date1.format(DATEFORMAT) === date2.format(DATEFORMAT);
  },

  /**
   * The date of the dashboard changes
   *
   * @param {Object} date - Moment date object. Will get formatted to YYYY-MM-DD
   *  and stored as the date
   */
  dateChange(date) {
    if (date === dashboardState.date) return;

    dashboardState.date = date;
    this.emit(CHANGEEVENT);
  },

  optionChange(option) {
    if (dashboardOptions.indexOf(option) < -1) return;

    dashboardState.activeOption = option;

    this.emit(CHANGEEVENT);
  }

});

Dispatcher.register(function(action) {
  switch(action.type) {
    case DATECHANGE:
      dashboardStore.dateChange(action.value);
      break;
    case OPTIONCHANGE:
      dashboardStore.optionChange(action.value);
      break;
  }
})

module.exports = {
  dashboardStore,

  /** Option possibilities */
  QUICKSTATS,
  TOTALSTORIES,
  TOTALMINUTES,
  PEAKCONCURRENT,
  TOPSTORIES,
  TOPAUTHORS,
  DATEFORMAT
};
