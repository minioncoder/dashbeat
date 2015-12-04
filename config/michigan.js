"use strict";

var freep = "#2095F2";
var detroitnews = "#F34235";
var lansingstatejournal = "#FEEA3A";
var hometownlife = "#B3E9F8";
var battlecreekenquirer = "#9800FE";
var thetimesherald = "#8AC249";
var livingstondaily = "#CD54B0";

module.exports = {
  "socketUrl": "https://api.michigan.com",
  "freep": {
    "color": freep
  },
  "detroitnews" : {
    "color": detroitnews
  },
  "lansingstatejournal": {
    "color": lansingstatejournal
  },
  "hometownlife": {
    "color": hometownlife
  },
  "battlecreekenquirer": {
    "color": battlecreekenquirer
  },
  "thetimesherald": {
    "color": thetimesherald
  },
  "livingstondaily": {
    "color": livingstondaily
  },
  "colors": {
    "$freep": freep,
    "$detroitnews": detroitnews,
    "$lansingstatejournal": lansingstatejournal,
    "$hometownlife": hometownlife,
    "$battlecreekenquirer": battlecreekenquirer,
    "$livingstondaily": livingstondaily,
    "$thetimesherald": thetimesherald
  },
  "mixins": {
    "colorsources": function() {
      return {
        "&.freep": {
          "background-color": freep
        },
        "&.detroitnews": {
          "background-color": detroitnews
        },
        "&.lansingstatejournal": {
          "background-color": lansingstatejournal
        },
        "&.hometownlife": {
          "background-color": hometownlife
        },
        "&.battlecreekenquirer": {
          "background-color": battlecreekenquirer
        },
        "&.thetimesherald": {
          "background-color": thetimesherald
        },
        "&.livingstondaily": {
          "background-color": livingstondaily
        }
      };
    }
  }
};
