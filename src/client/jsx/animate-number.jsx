'use strict';

import ReactDOM from 'react-dom';
import ReactNumberEasing from 'react-number-easing';

module.exports = function(value, id) {
  return ReactDOM.render(
    <ReactNumberEasing value={ value }/>,
    document.getElementById(id)
  )
};