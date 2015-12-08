'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import Ajax from './lib/ajax';

document.addEventListener('DOMContentLoaded', function() {
  refresh();
  timer();
});

function timer(reset=false, loopIt=true) {
  let timerEl = document.getElementById('timer');
  let time = 0;

  if (!reset) time = (timerEl.time || 0) + 1;
  timerEl.innerHTML = `Last updated: ${time} seconds ago`;
  timerEl.time = time;

  if (!loopIt) return;

  setTimeout(function() {
    timer();
  }, 1000);
}

async function refresh() {
  let data;
  try {
    data = await Ajax("/supervisor/info/");
  } catch (err) {
    console.log(err);
  }

  timer(true, false);

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
    let sortedProcs = this.props.procs.slice().sort(function(a, b) {
      let aTimer = getUnixTimer(a);
      let bTimer = getUnixTimer(b);

      return bTimer - aTimer;
    });

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
          stopTime={proc.stop}
          pos={getPos(sortedProcs, proc.name)} />
      );
    }

    return <div className="procList">{procs}</div>;
  };
};

function getPos(procs, procName) {
  for (let i = 0; i < procs.length; i++) {
    if (procs[i].name == procName) return i;
  }
}

function getUnixTimer(proc) {
  let timer = proc['start'];
  if (proc.statename != "RUNNING" && proc.statename != "RESTARTING") {
    timer = proc['stop'];
  }

  return timer;
}

function getTimer(proc) {
  let timer = proc['uptime'];
  if (proc.status != "running" && proc.status != "restarting") {
    timer = proc['downtime'];
  }
  return timer;
}

class Proc extends React.Component {
  constructor(props) { super(props); };
  render() {
    //{this.props.status}
    let procClass = "proc " + this.props.status;
    let statusClass = "status " + this.props.status;
    let timer = getTimer(this.props);
    let procStyle = { order: this.props.pos };

    return (
      <div className={procClass} style={procStyle}>
        {this.props.name}
      </div>
    );
  };
};
