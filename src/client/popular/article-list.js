'use strict';

import React from 'react';

import { getData, Overview } from './overview';
import Screen from '../lib/screen';

var mobileBp = 768;

export default class ArticleList extends React.Component {
  state = {
    freeze: false,
  };

  render() {
    // we must preserve the original order in which the articles
    // are generated in the DOM or else react will destroy/recreate those
    // elements and lose its previous state
    var sortedCopy = this.props.data.slice().sort(function(a, b) {
      return a.url.localeCompare(b.url);
    });

    let articles = [];
    for (let i = 0; i < sortedCopy.length; i++) {
      let article = sortedCopy[i];
      let sections = "";

      if (article.sections && article.sections.length) {
        sections = article.sections.join(", ");
      }

      let pos = this.props.data.indexOf(article);

      let art = <Article key={ article.article_id }
        id={ article.article_id }
        visits={ article.visits }
        url={ article.url }
        headline={ article.headline }
        sections={ sections }
        position={ pos } />;

      articles.push(art);
    }

    return (
      <div className="articleContainer">
        <ol className="articleList">
          {articles}
        </ol>
      </div>
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.freeze;
  };

  freeze(ev) {
    this.setState({ freeze: !this.state.freeze });
  };
};

class Article extends React.Component {
  constructor(props) {
    super(props);
  };

  state = {
    data: {},
    hasData: false,
    open: false
  };

  handleClick = async () => {
    if (!this.state.hasData) {
      try {
        let data = await getData(this.props.id);
        this.setState({ hasData: true, open: true, data });
        return;
      } catch (err) {
        throw err;
      }
    }

    this.setState({ open: !this.state.open });
  };

  closeOverview = (e) => {
    e.stopPropagation();
    this.setState({ open: false });
  };

  handleResize = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  };

  // article position in list
  getTopPosition(screen, factor=55) {
    if (screen.width < mobileBp) {
      factor = 40;
    }

    return this.props.position * factor;
  };

  // overview position
  getLeftPosition(screen, factor=52) {
    if (!this.state.open) {
      return 100;
    }

    if (screen.width < mobileBp) {
      factor = 10;
    }

    return factor;
  };

  render() {
    let screen = Screen(window, document);
    let left = this.getLeftPosition(screen) + "%";

    return (
      <li className='article' style={ {top: this.getTopPosition(screen)+'px'} }>
        <div className='readers'>{ this.props.visits }</div>
        <div className='content'>
          <div className='titleInfo' onClick={ this.handleClick }>
            <span className='title'>{ this.props.headline }</span>
          </div>
        </div>

        <Overview key={ this.props.id }
          visits={ this.props.visits }
          sections={ this.props.sections }
          hasData={ this.state.hasData }
          open={ this.state.open }
          left={ left }
          close={ this.closeOverview }
          data={ this.state.data } />
      </li>
    );
  };
}
