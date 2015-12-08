## Config files
In order to make Dashbeat transferrable to other markets, we've abstracted out information that is unique to each market.

### Config file format
Create a config file that exports an object with the following keys

#### { String } module.exports.socketUrl
Url to domain that hosts the web sockets used for updating the dashboards

#### { Array } module.exports.sites
Array of objects that specify each market in this dashbeat instance.

Each array index is an object that has has 3 keys:
* `name` - Text name of the news publication e.g. The Free Press
* `domain` - Domain at which the publication is hosted e.g. freep.com. NOTE: no "http://" required, just domain name
* `color` - HEX color that represents this market

#### { Array } module.exports.dashboards
An array of dashboards that are allowed for the given market. See ./index.dashboards for all possible dashboards

#### { Object } moudle.exports.mixins
PostCSS mixins that we be used in CSS preprocessing

### Example config file

```
'use strict';

var generatePostCSSMixins = require('./index').generatePostCSSMixins;

var usatoday = '#2095F2';

var sites = [{
  'name': 'USA Today',
  'domain': 'usatoday.com',
  'color': usatoday
}];

var dashboards = [
  'popular',
  'big-picture',
  'cities',
  'article-loyalty',
  'status',
  'author-percent',
  'authors',
  'geo-point',
  'stats',
  'recirculation',
  'viewers',
  'test-socket'
]

module.exports = {
  'socketUrl': 'http://api.thepul.se',
  'sites': sites,
  'dashboards': dashboards,
  'mixins': generatePostCSSMixins(sites)
};

```