import style from './style';
import parse from './parse';

// Maps source names sans '.com' to words
let sourceMap = {
  freep: 'Detroit Free Press',
  detroitnews: 'The Detroit News',
  battlecreekenquirer: 'Battle Creek Enquirer',
  hometownlife: 'Hometown Life',
  lansingstatejournal: 'Lansing State Journal',
  livingstondaily: 'Livingston Daily',
  thetimesherald: 'Port Huron Times Herald'
}
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  getRandomInt,
  style,
  parse,
  sourceMap
}
