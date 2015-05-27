'use strict';

import React from 'react';
import Velocity from 'velocity-animate/velocity.min';
import { style } from '../lib/';

// JSX
import ArticleSummary from './article-summary.jsx';
import ReactNumberEasing from 'react-number-easing';

var Article = React.createClass({
  moveArticle() {
    var rank = this.props.rank;
    var obj = this.getDOMNode().parentNode;
    var height = obj.scrollHeight;
    height += style.pixelToNumber(style.getStyle(obj, 'margin-bottom'));

    Velocity(obj, { top: (height * rank) });
  },
  componentDidUpdate(prevProps, prevState) {
    this.moveArticle();
  },
  componentDidMount() {
    this.moveArticle();
  },
  handleClick() {
    var data = {
      url: this.props.url,
      title: this.props.title
    };
    this.summary = new ArticleSummary(data, 'summary-container');
    this.summary.openSummary(data);
  },
  componentWillMount() {
    var urlAppends = ['www.', 'http://'];
    for (var i = 0; i < urlAppends.length; i++) {
      var append = urlAppends[i];
      if (this.props.url.indexOf(append) !== 0) {
        this.props.url = append + this.props.url;
      }
    }
    this.props.authorsClass = 'authors ';
    if (!this.props.authors.length) {
      this.props.authorsClass += 'hidden';
    }
  },
  render() {
    return (
      <div className='article' onClick={ this.handleClick }>
        <ReactNumberEasing value={ this.props.readers } className='readers'/>
        <div className='article-title'>
          <div className='title'>
            <a target='_blank' href={ this.props.url }>{ this.props.title }</a>
          </div>
          <div className='info'>
            <div className={ this.props.authorsClass }>
              { this.props.authors.join(', ') }
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
    <Article readers={ data.visits } url={ data.path } title={ data.title } rank={ data.rank } authors= { data.authors }/>,
    // document.getElementById(id)
    document.getElementById(id)
  )
}
