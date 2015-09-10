import Dispatcher from '../dispatcher';

/** Actions */
export let DATECHANGE = 'date-change';
export let CHANGEEVENT = 'dashboard-change';
export let OPTIONCHANGE = 'option-change';

/** Action class */
export class DashboardActions {

  /**
   * Change the date
   *
   * @param {Object} date - Moment date object
   */
  dateChange(date) {
    Dispatcher.dispatch({
      type: DATECHANGE,
      value: date
    })
  }

  dashboardOptionChange(option) {
    Dispatcher.dispatch({
      type: OPTIONCHANGE,
      value: option
    })
  }
}

