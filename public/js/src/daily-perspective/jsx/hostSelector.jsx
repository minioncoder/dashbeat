import React from 'react';

let Host = React.createClass({
  getDefaultProps() {
    return {
      hostName: '',
      callback: function() {},
      active: false
    }
  },
  hostClick() {
    this.props.callback(this.props.hostName);
  },
  render() {
    let className = 'host';
    if (this.props.active) className += ' active';

    return(
      <div className={ className } onClick={ this.hostClick }>{ this.props.hostName }</div>
    )
  }
});

let HostSelector = React.createClass({
  getDefaultProps() {
    return {
      hideHosts: true,
      hosts: [],
      controller: undefined,
      activeHost: ''
    }
  },
  toggleDropdown() {
    // Toggle the state of the dropdown
    this.setProps({
      hideHosts: !this.props.hideHosts
    });
  },
  hostClick(hostName) {
    let controller = this.props.controller;
    controller.hostChange(hostName);

    this.setProps({
      activeHost: hostName
    })
  },
  render() {
    var renderOption = (hostName, index) => {
      let active = false;
      if (this.props.activeHost === hostName) active = true;

      return <Host hostName={ hostName } callback={ this.hostClick } active={ active }/>
    }

    let hostDropdownClass = 'host-dropdown';
    if (!this.props.hideHosts) {
      hostDropdownClass += ' show';
    }
    return(
      <div className='host-select-container'>
        <div className='toggle' onClick={ this.toggleDropdown }>Hosts <i className='fa fa-caret-down'></i></div>
        <div className={ hostDropdownClass }>
          { this.props.hosts.map(renderOption) }
        </div>
      </div>
    )
  }
});

module.exports = function(hosts, controller) {

  return React.render(
    <HostSelector hosts={ hosts } controller={ controller }/>,
    document.getElementById('hosts')
  )
}