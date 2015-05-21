'use strict';

import each from 'lodash/collection/forEach';

import geo from './geo';
import stats from './stats';
import engage from './engage';
import popular from './popular';
import authors from './authors';
import viewers from './viewers';
import recirc from './recirculation';

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
  each(routes, function(route) {
    route(app);
  });
}