import React from 'react';

import HostSelector from './hostSelector.jsx';
import DatePicker from 'react-datepicker/dist/react-datepicker';

export default class DashboardControl extends React.Component {

  constructor(data) {
    super(data);

    this.state = {
      currentDay: this.props.currentDay
    }
  }

  dateChange(date) {
    this.props.dateChange(date);
  }

  hostChange(hostName) {
    this.props.dashboard.hostChange(hostName);
  }

  render() {
    return (
      <div className='dashboard-control'>
        <div className='control-container left'>
          <HostSelector hosts={ this.props.hosts } hostChange={ this.hostChange.bind(this) }/>
        </div>
        <div className='control-container right'>
          <DatePicker selected={ this.state.currentDay } dateFormat={ 'MM/DD/YYYY' } onChange={ this.dateChange.bind(this) } maxDate={ this.props.yesterday }/>
        </div>
      </div>
    )
  }
}