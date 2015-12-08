'use strict';

import React from 'react';

import City from './city';

export default class CitiesDashboard extends React.Component {
  constructor(args) {
    super(args);

    this.maxFontSize = 175;

    this.state = {
      cities: this.props.cities || [],
      total: 0,
      max: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let total = 0;
    let max = 0;
    for (let city of nextProps.cities) {
      total += city.total;
      if (city.total > max) max = city.total;
    }

    this.setState({
      cities: nextProps.cities,
      total,
      max
    })
  }

  renderCity = (city, index) => {
    let cityKey = city.name.replace(/ /g, '-');
    let width = (city.total / this.state.max) * 95;
    return <City index={ index }
              name={ city.name }
              total={ city.total }
              hostData={ city.hostData }
              width={ width }
              key={ cityKey }/>
  }

  render() {
    return (
      <div className='city-list'>
        { this.state.cities.slice(0, 40).map(this.renderCity) }
      </div>
    )
  }
}
