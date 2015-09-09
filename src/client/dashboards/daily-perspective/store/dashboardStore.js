import { EventEmitter } from 'events';

import assign from 'object-assign';
import moment from 'moment';

import { DATECHANGE, CHANGEEVENT } from '../action/dashboardAction';
import Dispatcher from '../dispatcher';

let dashboardState = {
  // Initialize the date to yesterday
  date: moment().subtract(1, 'days')
}

let dashboardStore = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGEEVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGEEVENT, callback);
  },

  getState() { return dashboardState },

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
  }

});

Dispatcher.register(function(action) {
  switch(action.type) {
    case DATECHANGE:
      dashboardStore.dateChange(action.value);
      break;
  }
})

module.exports = dashboardStore;
