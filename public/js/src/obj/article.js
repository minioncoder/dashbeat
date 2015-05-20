// var flight = require('../../../bower/flight');
var Handlebars = require('handlebars');
var $ = require('jquery-browserify');
var React = require('react');

var Article = React.createClass({
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

  React.render( 
    <Article readers={ data.visits } url={ data.path } title={ data.title }/>,
    document.getElementById(id)
  )
}