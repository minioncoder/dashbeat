'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Ajax from './lib/ajax';
import moment from 'moment';

document.addEventListener('DOMContentLoaded', function() {
  refresh();
});

async function refresh() {
  let data;
  try {
    data = await Ajax("/info/");
  } catch (err) {
    console.log(err);
  }

  ReactDOM.render(
    <ProcList procs={data.procs}/>,
    document.getElementById("proContainer")
  );

  setTimeout(function() {
    refresh();
  }, 10000);
};

class ProcList extends React.Component {
  constructor(props) { super(props); };
  render() {
    let procs = [];
    for (let i = 0; i < this.props.procs.length; i++) {
      let proc = this.props.procs[i];
      let uptime = moment.unix(proc.start);
      let downtime = moment.unix(proc.stop);
      uptime = uptime.fromNow();
      downtime = downtime.fromNow();

      procs.push(
        <Proc key={proc.name}
          name={proc.name}
          status={proc.statename.toLowerCase()}
          pid={proc.pid}
          uptime={uptime}
          downtime={downtime}
          startTime={proc.start}
          stopTime={proc.stop} />
      );
    }

    return (
      <div className="procList">{procs}</div>
    );
  };
};

class Proc extends React.Component {
  constructor(props) { super(props); };
  render() {
    //{this.props.status}
    let procClass = "proc b-" + this.props.status;
    let statusClass = "status " + this.props.status;
    let timer = this.props.uptime;
    if (this.props.status != "running" && this.props.status != "restarting") {
      timer = this.props.downtime;
    }

    return (
      <div className={procClass}>
        <div className={statusClass}></div> [{this.props.name}] since {timer}
      </div>
    );
  };
};
