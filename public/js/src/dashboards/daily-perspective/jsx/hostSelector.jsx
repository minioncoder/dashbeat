import React from 'react';

class Host extends React.Component {
  hostClick() {
    this.props.callback(this.props.hostName);
  }
  render() {
    let className = 'host';
    if (this.props.active) className += ' active';

    return(
      <div className={ className } onClick={ this.hostClick.bind(this) }>{ this.props.hostName }</div>
    )
  }
}

export default class HostSelector extends React.Component {
  constructor(data) {
    super(data);

    this.state = {
      hideHosts: true
    };
  }
  toggleDropdown() {
    // Toggle the state of the dropdown
    this.setState({
      hideHosts: !this.state.hideHosts
    });
  }

  hostClick(hostName) {
    this.props.hostChange(hostName);

    this.setState({
      activeHost: hostName
    })
  }

  renderOption(hostName, index) {
    let active = false;
    if (this.props.activeHost === hostName) active = true;

    return <Host hostName={ hostName } callback={ this.hostClick.bind(this) } active={ active }/>
  }

  render() {
    if (!this.state) {
      return (
        <div className=''></div>
      );
    }

    let hostDropdownClass = 'host-dropdown';
    if (!this.state.hideHosts) {
      hostDropdownClass += ' show';
    }
    return(
      <div className='hosts'>
        <div className='toggle' onClick={ this.toggleDropdown.bind(this) }>Hosts <i className='fa fa-caret-down'></i></div>
        <div className={ hostDropdownClass }>
          { this.props.hosts.map(this.renderOption.bind(this)) }
        </div>
      </div>
    )
  }
}