import _ from 'lodash';

import popular from './popular';
import authors from './authors';
import stats from './stats';
import engage from './engage';
import recirc from './recirculation';
import geo from './geo';
import viewers from './viewers';

// TODO simplify this cause the individual routes js files don't really do
// anything anymore
var routes = [
  popular,
  authors,
  stats,
  engage,
  recirc,
  geo,
  viewers
]

export default function init(app) {
  _.forEach(routes, function(route) {
    route(app);
  });
}