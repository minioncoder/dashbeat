import React from 'react';
import DatePicker from 'react-datepicker/dist/react-datepicker';
import moment from 'moment';

import { DashboardActions } from '../action';

let dashboardActions = new DashboardActions();

export default class DashboardControl extends React.Component {
  constructor(args) {
    super(args);

  }

  optionChange(e) {
    dashboardActions.dashboardOptionChange(e.target.value);
  }

  renderDashboardOptions() {
    function renderDashboardOption(opt, index) {
      return (
        <option value={ opt }>{ opt.replace(/-/g, ' ') }</option>
      )
    }

    return (
      <select className='option-select' value={ this.props.activeOption } onChange={ this.optionChange.bind(this) }>
        { this.props.availableOptions.map(renderDashboardOption.bind(this)) }
      </select>
    )
  }

  render() {
    return (
      <div className='dashboard-control'>
        <div className='control-container left'>
          { this.renderDashboardOptions() }
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
