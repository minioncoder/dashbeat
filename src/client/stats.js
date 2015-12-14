import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import { findSource } from './lib';
import Config from '../../config';

class Market extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      total: this.props.social + this.props.search + this.props.direct + this.props.links
    }
  }

  componentWillReceiveProps(nextProps) {
    let total = nextProps.social + nextProps.search + nextProps.direct + nextProps.links;
    this.setState({ total });
  }

  renderBar = () => {

    let barPortions = [{
      name: 'social',
      val: Math.round((this.props.social / this.state.total) * 100)
    }, {
      name: 'search',
      val: Math.round((this.props.search / this.state.total) * 100)
    }, {
      name: 'direct',
      val: Math.round((this.props.direct / this.state.total) * 100)
    }, {
      name: 'links',
      val: Math.round((this.props.links / this.state.total) * 100)
    }];

    return (
      <div className='bar-container'>
        <div className='bar'>
          {
            barPortions.map((p, i) => {
              let style = { width: `${p.val}%` };
              return (
                <div className={ `bar-portion ${p.name}` }
                  style={ style }
                  key={ `${this.props.source}-${p.name}` }>{p.val}%</div>
              );
            })
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={ `market ${this.props.source}-market` }>
        <div className='title'>{ findSource(this.props.source).name }</div>
        { this.renderBar() }
      </div>
    )
  }
}

let socket = io(Config.socketUrl, { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_quickstats');
socket.on('got_quickstats', (data) => {
  let stats = data.snapshot.stats.sort(function(a, b) { return a.source > b.source ? 1 : -1; });

  ReactDOM.render(
    (
      <div className='stats'>
        {
          stats.map(function(s, i) {
            return (
              <Market source={ s.source }
                  social={ s.social }
                  search={ s.search }
                  direct={ s.direct }
                  links={ s.links }
                  key={ `market-${s.source}` }/>
            )
          })
        }
      </div>
    ),
    document.getElementById('markets')
  )

});
