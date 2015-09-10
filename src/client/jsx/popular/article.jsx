'use strict';

import React from 'react';
import Velocity from 'velocity-animate/velocity.min';
import { style } from 'publicLib/';

// JSX
import ArticleSummary from '../article-summary.jsx';
//import ReactNumberEasing from 'react-number-easing';

var Article = React.createClass({
  moveArticle() {
    var rank = this.props.article.rank;
    var obj = this.getDOMNode().parentNode;
    var height = obj.scrollHeight;
    height += style.pixelToNumber(style.getStyle(obj, 'margin-bottom'));

    var newTop = height * rank;

    Velocity(obj, { top: (height * rank) });

    if (newTop % 61) {
      console.log(obj);
    }
  },
  handleClick() {
    var data = {
      url: this.props.article.path,
      title: this.props.article.title,
      article: this
    };

    // this.props.summary = new ArticleSummary(data, 'summary-container');
    this.setProps({ summary: new ArticleSummary(data, 'summary-container') });
  },
  componentDidUpdate(prevProps, prevState) {
    this.moveArticle();

    // Update the summary
    if (this.props.summary) {
      this.props.summary.setProps({
        url: this.props.article.path,
        title: this.props.article.title,
        article: this
      });
    }
  },
  componentWillMount() {
    this.props.authorsClass = 'authors ';
    if (!this.props.article.authors.length) {
      this.props.authorsClass += 'hidden';
    }
  },
  componentDidMount() {
    this.moveArticle();
  },
  render() {
    return (
      <div className='article' onClick={ this.handleClick }>
        <ReactNumberEasing value={ this.props.article.visits } className='readers'/>
        <div className='article-title'>
          <div className='title'>
            <a target='_blank' href={ this.props.article.path }>{ this.props.article.title }</a>
          </div>
          <div className='info'>
            <div className={ this.props.authorsClass }>
              { this.props.article.authors.join(', ') }
            </div>
            <div className='time'>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = function(data, id) {
  return React.render(
    <Article article={ data }/>,
    // document.getElementById(id)
    document.getElementById(id)
  )
}
