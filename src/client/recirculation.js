import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import { roundTwoDecimals } from './lib/parse';

class ReactGauge extends React.Component {
  constructor(props) {
    super(props);
    // TODO put resize handler in here to resize svg

    this.colors = {
      blue: '#255C69',
      green: '#2A7F40',
      orange: '#AA7139',
      red: '#AA4639'
    }
  }

  getStyles = () => {
    let xLeft = 0;
    let xMiddle = Math.round(this.props.width / 2);
    let xRight = this.props.width;

    let yTop = 0;
    let yMiddle = Math.round(this.props.height / 2);
    let yBottom = this.props.height;

    let percent = this.props.value / this.props.max;
    let degrees = percent * 180;

    // Outer circle
    let outerCircle = {
      r: xMiddle,
      cx: xMiddle,
      cy: yBottom
    }

    // Inner circle
    let innerCircle = {
      r: xMiddle * .8,
      cx: xMiddle,
      cy: yBottom
    }

    // Needle
    let needleCircle = {
      r: Math.round(this.props.width / 10),
      cx: Math.round(this.props.width / 2),
      cy: this.props.height
    }

    let needleWidth = 10;
    let needlePath = {
      d: `M ${xMiddle} ${yBottom - needleWidth} L 0 ${yBottom - needleWidth}`,
      strokeWidth: needleWidth
    }

    let needleStyle = {
      transformOrigin: '100% 50% 0',
      transform: `rotate(${degrees}deg)`
    }

    // Text
    let textStyle = {
      text: `${ roundTwoDecimals(percent * 100) }%`,
      x: xMiddle,
      y: yBottom * .6
    }

    return { outerCircle, innerCircle, needleCircle, needlePath, needleStyle, textStyle }
  }

  render() {
    let styles = this.getStyles();

    return(
      <svg width={ this.props.width } height={ this.props.height }>
        <circle r={ styles.outerCircle.r }
            cx={ styles.outerCircle.cx  }
            cy={ styles.outerCircle.cy }
            fill={ this.colors.blue }>
        </circle>
        <circle r={ styles.innerCircle.r }
            cx={ styles.innerCircle.cx }
            cy={ styles.innerCircle.cy }
            fill="white">
        </circle>
        <text x={ styles.textStyle.x } y={ styles.textStyle.y }
          fontSize='60'
          fontFamily='Arimo'
          textAnchor='middle'
          fill={ this.colors.blue }>
            { styles.textStyle.text }
        </text>
        <g className="needle">
          <circle r={ styles.needleCircle.r }
              cx={ styles.needleCircle.cx  }
              cy={ styles.needleCircle.cy }
              fill={ this.colors.red }>
          </circle>
          <path style={ styles.needleStyle }
              d={ styles.needlePath.d }
              stroke={ this.colors.red }
              strokeWidth={ styles.needlePath.strokeWidth }>
          </path>
        </g>
      </svg>
    )
  }
}
ReactGauge.defaultProps = { width: 500, height: 250, min: 0, max: 100, value: 0};

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
