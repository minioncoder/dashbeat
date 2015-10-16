import style from './style';
import parse from './parse';

// Maps source names sans '.com' to words
let sourceMap = {
  freep: 'Free Press',
  detroitnews: 'Detroit News',
  battlecreekenquirer: 'Battle Creek',
  hometownlife: 'Hometown Life',
  lansingstatejournal: 'LSJ',
  livingstondaily: 'Livingston',
  thetimesherald: 'Times Herald'
}

module.exports = {
  style,
  parse,
  sourceMap
}
