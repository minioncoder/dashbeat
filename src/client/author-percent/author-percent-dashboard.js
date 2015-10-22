'use strict';

import React from 'react';

import { AuthorPercentStore } from './store';
import Author from './author';

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
        if (!author) author = host.authors.set(name, { source, name, percent: 0, articles: []}).get(name);

        author.percent += percent;
        author.articles.push(article);
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
  }

  renderAuthor = (author, index) => {
    return <Author author={ author } index={ index } key={ `${author.source}-${author.name}` } />
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
        <div className='menu'>
          <div className='title'>Author Impact</div>
          <div className='subtitle'>Which authors are driving the highest percentage of traffic to their sites?</div>
          <div className='legend'>
            <div className='legend-item'>
              <div className='swatch freep'></div>
              <div className='name'>Free Press</div>
            </div>
            <div className='legend-item'>
              <div className='swatch detroitnews'></div>
              <div className='name'>Detroit News</div>
            </div>
            <div className='legend-item'>
              <div className='swatch lansingstatejournal'></div>
              <div className='name'>Lansing State Journal</div>
            </div>
            <div className='legend-item'>
              <div className='swatch hometownlife'></div>
              <div className='name'>Observer and Eccentric</div>
            </div>
            <div className='legend-item'>
              <div className='swatch battlecreekenquirer'></div>
              <div className='name'>Battle Creek</div>
            </div>
            <div className='legend-item'>
              <div className='swatch thetimesherald'></div>
              <div className='name'>Port Huron</div>
            </div>
            <div className='legend-item'>
              <div className='swatch livingstondaily'></div>
              <div className='name'>Livingston Daily</div>
            </div>
          </div>
        </div>
        <div className='dashboard'>
          { this.state.authors.map(this.renderAuthor) }
        </div>
      </div>
    )
  }
}
