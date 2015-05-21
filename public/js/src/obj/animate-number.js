import React from 'react';
import ReactNumberEasing from 'react-number-easing';

module.exports = function(value, id) {

  return React.render(
    <ReactNumberEasing value={ value }/>,
    document.getElementById(id)
  )
}