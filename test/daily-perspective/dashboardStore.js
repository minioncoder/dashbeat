import { equal } from 'assert';

import moment from 'moment';

import { dashboardStore } from '../../src/client/dashboards/daily-perspective/store';
import { DashboardActions } from '../../src/client/dashboards/daily-perspective/action';

let actions = new DashboardActions();
let yesterday = moment().subtract(1, 'days');

describe('Daily Perspective store tests', function() {
  it('Tests date change', function() {
    let currentDate = dashboardStore.getState().date;
    equal(dashboardStore.sameDates(currentDate, yesterday), true, 'Default date should be yesterday');

    let newDate = moment().subtract(100, 'days');
    actions.dateChange(newDate);
    let storedDate = dashboardStore.getState().date;

    equal(dashboardStore.sameDates(newDate, storedDate), true, 'New date didn\'t update');
  });
})
