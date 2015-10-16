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

module.exports = {
  style,
  parse,
  sourceMap
}
