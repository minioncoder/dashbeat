"use strict";

var usatoday = "#2095F2";

module.exports = {
  "socketUrl": "http://api.thepul.se",
  "sites": [{
    "name": "USA Today",
    "className": "usatoday",
    "color": usatoday
  }],
  "vars": {
    "$usatoday": usatoday
  },
  "mixins": {
    "sites": function() {
      return {
        ".usatoday": {
          "background-color": usatoday
        }
      }
    }
  }
};
