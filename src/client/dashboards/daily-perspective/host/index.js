/**
 * Module used to render the Daily Perspective of a given host
 */

import _each from 'lodash/collection/forEach';
import _values from 'lodash/object/values';
import React from 'react';

import Articles from './dashboards/articles';
import Authors from './dashboards/authors';
import Sections from './dashboards/sections';

/* React Components */
export default class Host extends React.Component {
  constructor(data) {
    super(data);

    this.compileDashboardOptions(this.props);

    this.currentDashboard = this.dashboardOptions.Articles.name;
  }

  componentWillReceiveProps(nextProps) {
    this.compileDashboardOptions(nextProps);
  }

  /**
   * Update data stored for a given host. use this.dashboardOptions
   */
  compileDashboardOptions(data) {
    this.dashboardOptions = {
      Articles: {
        name: 'Articles',
        data: data.toppages,
        obj: <Articles data={ data.toppages }/>
      },
      Authors: {
        name: 'Authors',
        data: data.topauthors,
        obj: <Authors data={ data.topauthors }/>
      },
      Sections: {
        name: 'Sections',
        data: data.topsections,
        obj: <Sections data={ data.topsections }/>
      }
    }
  }

  dashboardOptionClick(name) {
    if (!(name in this.dashboardOptions)) return;

    this.currentDashboard = name;
    this.setState({
      asdf: true
    })
    // this.render();
  }

  generateDashboardOption(option, index) {
    return <DashboardSelector name={ option.name } clickHandler={ this.dashboardOptionClick.bind(this) } selected={ this.currentDashboard === option.name }/>
  }

  generateDashboardContent() {
    return this.dashboardOptions[this.currentDashboard].obj;
  }

  render() {

    let className = `host-dashboard ${this.props.hostName}`;
    return (
      <div className={ className }>
        <div className='host-name'>{ this.props.hostName }</div>
        <div className='dashboard-selector'>
          { _values(this.dashboardOptions).map(this.generateDashboardOption.bind(this)) }
        </div>
        <div className='dashboard-content'>
          { this.generateDashboardContent() }
        </div>
      </div>
    )
  }
}

class DashboardSelector extends React.Component {
  handleClick() {
    this.props.clickHandler(this.props.name);
  }

  render() {
    let className = 'dashboard-option';
    if (this.props.selected) {
      className += ' selected';
    }
    return (
      <div className={ className } onClick={ this.handleClick.bind(this) }>
        { this.props.name }
      </div>
    )
  }
}
/* End React Components */
