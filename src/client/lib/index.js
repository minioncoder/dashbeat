import style from './style';
import parse from './parse';
import Config from '../../../config';

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function findSource(source, sites=Config.sites) {
  for (let i = 0; i < sites.length; i++) {
    let site = sites[i];
    if (site.className.indexOf(source) >= 0) return site;
  }

  return;
}

function sourceColor(source) {
  var color = "#000";
  var configSource = findSource(source);

  if (configSource && configSource.color) color = configSource.color;

  return color;
}

module.exports = {
  getRandomInt,
  style,
  parse,
  findSource,
  sourceColor
}
