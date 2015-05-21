'use strict';

var $ = window.jQuery = require('jquery');
var React = require('react');
var velocity = require('velocity-animate');

var Article = React.createClass({
  moveArticle: function() {
    var rank = this.props.rank;
    var $obj = $(this.getDOMNode()).parent('.article-container');
    var height = $obj.outerHeight(true);

    $obj.velocity({
      top: height * rank
    });
  },
  updateArticle: function(opts) {
    var oldRank = this.props.rank;

    this.setProps(opts);

    if ('rank' in opts) {
      var newRank = opts.rank;
      if (newRank != oldRank) {
        this.moveArticle();
      }
    }
  },
  render: function() {
    return (
      <div className='article container-fluid'>
        <div className='row'>
          <div className='col-md-1 col-sm-2 col-xs-2 readers'>{ this.props.readers }</div>
          <div className='col-md-11 col-sm-10 col-xs-10 title'><a target='_blank' href={ this.props.url }>{ this.props.title }</a></div>
        </div>
      </div>
    )
  }
});

module.exports = function(data, id) {
  // If the path doesn't start with http, append it to path
  if (data.path.indexOf('http://') !== 0) {
    data.path = 'http://' + data.path;
  }

  return React.render(
    <Article readers={ data.visits } url={ data.path } title={ data.title } rank={ data.rank }/>,
    document.getElementById(id)
  )
}