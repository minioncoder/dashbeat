import React from 'react';
import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate';

export default class City extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      index: this.props.index || -1,
      name: this.props.name || '',
      total: this.props.total || 0,
      hostData: this.props.hostData || {}
    }
  }

  componentDidMount() {
    this.animateMovement();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.index != this.props.index) this.animateMovement(nextProps.index);
  }

  animateMovement(index=this.props.index) {
    let style = {
      top: `${(index % 20) * 5}%`,
      left: `${index >= 20 ? 50 : 0}%`
    }

    Velocity(ReactDOM.findDOMNode(this), style)
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
