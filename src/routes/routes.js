import _ from 'lodash';

import popular from './popular';
import authors from './authors';
import stats from './stats';
import engage from './engage';
import recirc from './recirculation';
import geo from './geo';

var routes = [
  {
    url: '/',
    router: popular.router
  },
  {
    url: '/authors/',
    router: authors.router
  },
  {
    url: '/stats/',
    router: stats.router
  },
  {
    url: '/engage/',
    router: engage.router
  },
  {
    url: '/recirculation/',
    router: recirc.router
  },
  {
    url: '/geo/',
    router: geo.router
  }
]

function init(app) {
  _.forEach(routes, function(route) {
    app.use(route.url, route.router);
  });
}

module.exports = {
  init: init
}