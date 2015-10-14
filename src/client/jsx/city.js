import React from 'react';

export default class City extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      rank: this.props.rank || -1,
      name: this.props.name || '',
      total: this.props.total || 0,
      hostData: this.props.hostData || {}
    }
  }

  renderBar = () => {
    let hostData = this.state.hostData;
    let sortedHosts = [];
    let totalVal = 0;
    for (var host in hostData) {
      totalVal += hostData[host];
      sortedHosts.push({
        host: host,
        val: hostData[host]
      })
    }
    sortedHosts = sortedHosts.sort(function(a, b) { return b.val - a.val; })

    function renderBar(option, index) {
      let style = {
        width: `${( option.val / totalVal ) * 100}%`
      }

      return (
        <div className={ `bar-portion ${option.host}` } style={ style } key={ `${this.state.name}-${option.host}` }>
        </div>
      )
    }

    let style = {
      width: `${this.props.width}%`
    }

    return (
      <div className='bar' style={ style }>
        { sortedHosts.map(renderBar.bind(this)) }
      </div>
    )
  }

  render() {
    return (
      <div className='city'>
        <div className='name'>{ this.props.name }</div>
        <div className='total'>{ this.props.total }</div>
        <div className='bar-container'>
          { this.renderBar() }
        </div>
      </div>
    )
  }
}
