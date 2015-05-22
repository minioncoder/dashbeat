'use strict';

import JSONP from 'browser-jsonp';

JSONP({
  url: 'http://www.freep.com/news/json',
  success: function(data) {
    console.log(data);
  }
});