var constants = require('../../helpers/constants');
var db = require('../db');
var mongoose = db.mongoose;

var name = 'Cache';

/** Schema stuff */
var cacheSchema = new mongoose.Schema({
  socket: { // Name of the socket/beat that this cache is valid for
    type: String,
    required: '\'socket\' value is required for a Cache schema',
    unique: true,
    validator: function(val) { // TODO verify this is a valid socket name
      return true
    }
  }, 
  cache: { // Pass anything here, cache will JSON.stringify and JSON.parse as needed
    type: String,
    default: '',
    get: function(val) {
      // TODO error handle, maybe
      if (val) {
        return JSON.parse(val);  
      }
      else {
        return '';
      }
      
    },
    set: function(val) {
      // TODO error handle, maybe
      if (val) {
        return JSON.stringify(val);  
      }
      else {
        return '';
      }
    }
  }
});

/** Model stuff */
var Cache = mongoose.model(name, cacheSchema);

module.exports = {
  schema: cacheSchema,
  model: Cache,
  name: name
}