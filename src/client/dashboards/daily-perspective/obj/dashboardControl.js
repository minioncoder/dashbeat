import React from 'react';
import DatePicker from 'react-datepicker/dist/react-datepicker';
import moment from 'moment';

import { DashboardActions } from '../action';

let dashboardActions = new DashboardActions();

export default class DashboardControl extends React.Component {

  render() {
    return (
      <div className='dashboard-control'>
        <div className='control-container left'>
        </div>
        <div className='control-container right'>
          <DatePicker selected={ this.props.currentDay}
              dateFormat={ 'MM/DD/YYYY' }
              onChange={ dashboardActions.dateChange }
              maxDate={ moment().subtract(1, 'days') }/>
        </div>
      </div>
    )
  }
}
