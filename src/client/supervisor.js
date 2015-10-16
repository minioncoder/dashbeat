'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Ajax from './lib/ajax';

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
      procs.push(
        <Proc key={proc.name}
          name={proc.name}
          status={proc.statename}
          description={proc.description} />
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
    return (
      <div className="proc">
        {this.props.name} - {this.props.status}
        <p>{this.props.description}</p>
      </div>
    );
  };
};