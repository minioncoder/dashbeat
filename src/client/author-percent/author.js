'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate';

export default class Author extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      showArticles: false
    };
  };

  componentDidMount() {
    this.animateAuthor();
  };

  componentDidUpdate(lastProps, lastState) {
    if (lastProps.index !== this.props.index) this.animateAuthor();
  };

  showArticles = () => {
    this.setState({ showArticles: true });
  };

  hideArticles = () => {
    this.setState({ showArticles: false });
  };

  animateAuthor = () => {
    let style = { top: `${this.props.index * 5}%` };

    Velocity(ReactDOM.findDOMNode(this), style);
  };

  renderArticle = (article, index) => {
    return (
      <div className='article' key={ `${this.props.author.name}-article-${index}` }>
        <div className='count'>{ `${article.percent}%`}</div>
        <div className='headline'><a target='_blank' href={ `http://${article.url}` }>{ article.headline }</a></div>
      </div>
    );
  };

  render() {
    let author = this.props.author;
    let style = { width: `${author.percent}%` }
    let articlesClass = `articles ${this.state.showArticles ? 'show' : ''}`;
    return (
      <div className='author' onMouseEnter={ this.showArticles } onMouseLeave={ this.hideArticles }>
        <div className='name'>{ author.name }</div>
        <div className='percent'>{ `${author.percent}%` }</div>
        <div className='bar-container'>
          <div className={ `bar ${author.source}`} style={style}></div>
        </div>

        <div className={ articlesClass }>
          { author.articles.map(this.renderArticle) }
        </div>
      </div>
    );
  };
};

