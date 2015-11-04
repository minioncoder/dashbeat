import React from 'react';
import ReactGauge from 'react-gauge';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import { roundTwoDecimals } from './lib/parse';

ReactDOM.render(
  <ReactGauge/>,
  document.getElementById('gauge')
)

let socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_quickstats');
socket.on('got_quickstats', (data) => {
  let stats = data.snapshot.stats;
  let totalArticle = 0;
  let totalRecirc = 0;
  for (let market of stats) {
    totalArticle += market.article;
    totalRecirc += market.recirc;
  }

  let recircPercent = (totalRecirc / totalArticle) * 100;
  ReactDOM.render(
    <ReactGauge value={ roundTwoDecimals(recircPercent) }/>,
    document.getElementById('gauge')
  )
});
