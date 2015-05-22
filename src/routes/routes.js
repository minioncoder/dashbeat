'use strict';

import each from 'lodash/collection/forEach';

import popular from './popular';
import authors from './authors';

// TODO simplify this cause the individual routes js files don't really do
// anything anymore
var routes = [
  popular,
  authors
];

export default function init(app) {
  each(routes, function(route) {
    route(app);
  });
}