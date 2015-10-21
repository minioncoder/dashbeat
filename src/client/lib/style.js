'use strict';

function getStyle(el,styleProp) {
  if (el.currentStyle) {
    var y = el.currentStyle[styleProp];
  }
  else if (window.getComputedStyle) {
    var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
  }
  return y;
}
  /**
   *  Given a CSS pixel value, parse out the 'px'.
   *  E.g. 300px -> 300
   */
function pixelToNumber(value) {
  return parseInt(value.replace(/px$/, ''), 10);
}

module.exports = {
  getStyle,
  pixelToNumber
};
