var _ = require('lodash');
var util = require('util');

var popular = require('./popular');
var authors = require('./authors');
var geo = require('./geo');
var engage = require('./engage');
var recirculation = require('./recirculation');

var beats = [{
  obj: popular,
  url: '/'
},{
  obj: authors,
  url: '/authors'
}, {
  obj: geo,
  url: '/geo'
}, {
  obj: engage, 
  url: '/engage'
}, {
  obj: recirculation,
  url: '/recirculation'
}]

function initBeats(app) {
  _.forEach(beats, function(beat) {
    if (!beat.hasOwnProperty('obj') || 
        !beat.hasOwnProperty('url')) {

      console.log('Invalid beat:\n' + util.inspect(beat));
      return;
    }

    app.use(beat.url, beat.obj.router);
    beat.obj.beat(app);
  });
}

module.exports = {
  initBeats: initBeats
}