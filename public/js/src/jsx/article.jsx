'use strict';

import React from 'react';
import Velocity from 'velocity-animate/velocity.min';
import { style } from '../lib/';

// JSX
import ArticleSummary from './article-summary.jsx';

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
    // var summary = ArticleSummary(data, 'summary-container');
  },
  componentWillMount() {
    var urlAppends = ['www.', 'http://'];
    for (var i = 0; i < urlAppends.length; i++) {
      var append = urlAppends[i];
      if (this.props.url.indexOf(append) !== 0) {
        this.props.url = append + this.props.url;
      }
      console.log(this.props.url);
    }
    this.props.authorsClass = 'col-md-6 authors ';
    if (!this.props.authors.length) {
      this.props.authorsClass += 'hidden';
    }
  },
  render() {

    return (

      <div className='article container-fluid' onClick={this.handleClick}>
        <div className='row'>
          <div className='col-md-1 col-sm-2 col-xs-2 readers'>{ this.props.readers }</div>
          <div className='col-md-11 col-sm-10 col-xs-10'>
            <div className='row'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-md-12 title'>
                    <a target='_blank' href={ this.props.url }>{ this.props.title }</a>
                  </div>
                </div>
                <div className='row info'>
                  <div className={ this.props.authorsClass }>
                    { this.props.authors.join(', ') }
                  </div>
                  <div className='col-md-6 time'>
                  </div>
                </div>
              </div>
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
