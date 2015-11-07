'use strict';

import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Velocity from 'velocity-animate';

let socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling']});

let TIMEFORMAT = 'MMMM Do YYYY hh:mm:ss a';

class Snapshot extends React.Component {
  static defaultProps() {
    return {
      name: '',
      className: '',
      createdAt: '',
      blurb: ''
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.createdAt === this.props.createdAt) return;

    let color = '#C1C1C1';
    let ref = this.refs['updated-at'];
    ref.style.color = 'green';
    Velocity(ref, { color }, { delay: 2000, duration: 1000 })
  }

  render() {
    return (
      <div className={ `snapshot` } key={ this.props.className }>
        <div className='name'>{ this.props.name }</div>
        <div className='updated-at' ref='updated-at'>{ this.props.createdAt }</div>
        <div className='blurb'>{ this.props.blurb }</div>
      </div>
    )
  }
}

socket.emit('get_popular');
socket.on('got_popular', function(data) {
  let snapshot = data.snapshot;

  ReactDOM.render(
    <Snapshot name='Top Pages'
      id='toppages'
      createdAt={ moment(snapshot.created_at).format(TIMEFORMAT) }
      blurb={ `Number of popular articles: ${snapshot.articles.length}` }/>,
    document.getElementById('toppages')
  )
});

socket.emit('get_articles');
socket.on('got_articles', function(data) {
  ReactDOM.render(
    <Snapshot name='Articles'
      id='articles'
      createdAt={ moment().format(TIMEFORMAT) }
      blurb={ `Number of articles stored: ${data.articles.length}` }/>,
    document.getElementById('articles')
  )

});

socket.emit('get_quickstats');
socket.on('got_quickstats', function(data) {
  let snapshot = data.snapshot;
  let totalVisits = 0;
  for (let host of snapshot.stats) { totalVisits += host.visits; }

  ReactDOM.render(
    <Snapshot name='Quick Stats'
      id='quickstats'
      createdAt={ moment(snapshot.created_at).format(TIMEFORMAT) }
      blurb={ `Total combined visitors: ${ totalVisits }` }/>,
    document.getElementById('quickstats')
  )
});

socket.emit('get_topgeo');
socket.on('got_topgeo', function(data) {
  let snapshot = data.snapshot;
  let detTotal = 0;
  for (let city of snapshot.cities) {
    if (!('Detroit' in city.cities)) continue;
    detTotal += city.cities.Detroit;
  }

  ReactDOM.render(
    <Snapshot name='Top Geo'
      id='topgeo'
      createdAt={ moment(snapshot.created_at).format(TIMEFORMAT) }
      blurb={ `Total number of readers in Detroit: ${detTotal}` }/>,
    document.getElementById('topgeo')
  )
});

socket.emit('get_referrers');
socket.on('got_referrers', function(data) {
  let snapshot = data.snapshot;
  ReactDOM.render(
    <Snapshot name='Referrers'
      id='referrers'
      createdAt={ moment(snapshot.created_at).format(TIMEFORMAT) }
      blurb={''}/>,
    document.getElementById('referrers')
  );
});

socket.emit('get_recent');
socket.on('got_recent', function(data) {
  let snapshot = data.snapshot;
  ReactDOM.render(
    <Snapshot name='Recent'
      id='recent'
      createdAt={ moment(snapshot.created_at).format(TIMEFORMAT) }
      blurb={''}/>,
    document.getElementById('recent')
  );
});

socket.emit('get_traffic_series');
socket.on('got_traffic_series', function(data) {
  let snapshot = data.snapshot;
  ReactDOM.rendre(
    <Snapshot name='Traffic Series'
      id='traffic-series'
      createdAt={ moment(snapshot.created_at).format(TIMEFORMAT) }
      blurb={''}/>,
    document.getElementById('traffic-series')
  )
});
