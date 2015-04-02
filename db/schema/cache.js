var constants = require('../../helpers/constants');
var db = require('../db');
var mongoose = db.mongoose;

var name = 'Cache';
var collectionName = name.toLowerCase() + 's';

/** Schema stuff */
var cacheSchema = new mongoose.Schema({
  socket: { // Name of the socket/beat that this cache is valid for
    type: String,
    validator: function(val) { // TODO verify this is a valid socket name maybe
      return true
    }
  },
  cache: { // Pass anything here, cache will JSON.stringify and JSON.parse as needed
    type: Object,
    default: {},
  },
  createdAt: { // Time the cache was created
               // http://mongoosejs.com/docs/api.html#schema_date_SchemaDate-expires
    type: Date,
    default: function() {
      return new Date;
    },
    expires: 60 * 60 * 24 * 30 // 30 days
  }
});

cacheSchema.pre('delete', function(next) {
  console.log('deleting schema');
});

/** Model stuff */
var Cache = mongoose.model(name, cacheSchema);

module.exports = {
  schema: cacheSchema,
  model: Cache,
  name: name,
  collectionName: collectionName
}