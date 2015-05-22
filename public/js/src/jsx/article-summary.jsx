import React from 'react';
import request from 'request';
import Velocity from 'velocity-animate';
import { parse } from '../lib/index';

var ArticleSummary = React.createClass({
  fetchInfo() {
    var url = this.props.url + 'json';
    request({
      baseUrl: document.location.origin,
      url: '/get-article/',
      qs: {
        url: url
      }
    },
    function(error, response, body) {
      if (error) throw Error(error);
      console.log(body);
    });
  },
  slideIn() {
    var parent = this.getDOMNode.parentNode;
    Velocity(parent, {
      left: '50%'
    });
  },
  componentWillMount() {
    this.slideIn();
    this.fetchInfo();

    this.setState({ loading: true });
  },
  render() {
    var summaryClass = 'article-summary ';
    if (this.state.loading) {
      summaryClass += 'loading';
    }
    else {
      summaryClass = 'loaded';
    }
    return (
      <div className={ summaryClass }>
        <div className='article-info'>
          <div className='row article-image'>
          </div>
          <div className='row title'><a target='_blank' href={ this.props.url }>{ this.props.title }</a></div>
          <div className='row summary'>
          </div>
        </div>
        <div className='article-loading'>
        </div>
      </div>
    )
  }
});

module.exports = function(data, id) {
  return React.render(
    <ArticleSummary title={ data.title } url={ data.url }/>,
    document.getElementById(id)
  )
}