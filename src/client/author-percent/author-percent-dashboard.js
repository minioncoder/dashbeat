'use strict';

import React from 'react';

import { AuthorPercentStore } from './store';

export default class Dashboard extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      authors: []
    }

    AuthorPercentStore.addChangeListener(this.stateChange);
  }

  stateChange = (stats) => {
    if (!Object.keys(stats.quickstats).length) {
      console.log('no quicksats');
      return;
    } else if (!Object.keys(stats.toppages).length) {
      console.log('no toppages');
      return;
    }

    let totals = new Map();
    for (let host of stats.quickstats.stats) {
      totals.set(host.source, {
        total: host.visits,
        authors: new Map(),
      });
    }

    for (let article of stats.toppages.articles) {
      // Account for divide by 0
      if (!totals.get(article.source) || !totals.get(article.source).total) continue;

      let host = totals.get(article.source);
      let source = article.source;
      let percent = Math.round((article.visits / host.total) * 100);
      for (let name of article.authors) {
        let author = host.authors.get(name);
        if (!author) author = host.authors.set(name, { source, name, percent: 0}).get(name);


        host.authors.set(name, {
          source,
          name,
          percent: author.percent + percent
        });
      }
    }

    let authorList = [];
    for (let source of totals.values()) {
      authorList = authorList.concat([...source.authors.values()]);
    }

    this.setState({
      authors: authorList.sort(function(a, b) { return b.percent - a.percent; }).slice(0, 40)
    })
  }

  renderAuthor = (author, index) => {
    return (
      <div className='author' key={ `${author.source}-${author.name}` }>
        <div className='percent'>{ author.percent }</div>
        <div className='source'><img src={ `/img/hostimages/${author.source}.png` }/></div>
        <div className='name'>{ author.name }</div>
      </div>
    )
  }

  render() {
    if (!this.state.authors.length) {
      return (
        <div className='dashboard-container'>
          <p>No authors</p>
        </div>
      )
    }

    return (
      <div className='dashboard-container'>
        <div className='title'>Which authors are directing the most traffic to their site?</div>
        <div className='dashboard'>
          { this.state.authors.map(this.renderAuthor) }
        </div>
      </div>
    )
  }
}
