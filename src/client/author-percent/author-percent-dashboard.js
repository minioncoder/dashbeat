'use strict';

import React from 'react';

import { AuthorPercentStore } from './store';
import Author from './author';
import Legend from '../lib/legend';
import Config from '../../../config';

export default class Dashboard extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      authors: []
    }

    AuthorPercentStore.addChangeListener(this.stateChange);
  };

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
        if (!author) author = host.authors.set(name, { source, name, percent: 0, articles: []}).get(name);

        author.percent += percent;
        author.articles.push({
          percent: Math.round((article.visits / host.total) * 100),
          headline: article.headline,
          url: article.url
        });
        author.articles = author.articles.sort(function(a, b) { return b.visits - a.visits; });
        host.authors.set(name, author);
      }
    }

    let authorList = [];
    for (let source of totals.values()) {
      authorList = authorList.concat([...source.authors.values()]);
    }

    this.setState({
      authors: authorList.sort(function(a, b) { return b.percent - a.percent; }).slice(0, 20)
    });
  };

  renderAuthor = (author, index) => {
    return <Author author={ author } index={ index } key={ `${author.source}-${author.name}` } />
  };

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
        <div className='menu'>
          <div className='title'>Author Impact</div>
          <div className='subtitle'>Which authors are driving the highest percentage of traffic to their sites?</div>
          <Legend sites={ Config.sites } />
        </div>
        <div className='dashboard'>
          { this.state.authors.map(this.renderAuthor) }
        </div>
      </div>
    );
  };
};
