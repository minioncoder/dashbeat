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
  "sites": [{
    "name": "The Free Press",
    "className": "freep",
    "color": freep
  }, {
    "name": "The Detroit News",
    "className": "detroitnews",
    "color": detroitnews
  }, {
    "name": "Lansing State Journal",
    "className": "lansingstatejournal",
    "color": lansingstatejournal
  }, {
    "name": "Hometownlife",
    "className": "hometownlife",
    "color": hometownlife
  }, {
    "name": "Battle Creek Enquirer",
    "className": "battlecreekenquirer",
    "color": battlecreekenquirer
  }, {
    "name": "The Times Herald",
    "className": "thetimesherald",
    "color": thetimesherald
  }, {
    "name": "Livingston Daily",
    "className": "livingstondaily",
    "color": livingstondaily
  }],
  "vars": {
    "$freep": freep,
    "$detroitnews": detroitnews,
    "$lansingstatejournal": lansingstatejournal,
    "$hometownlife": hometownlife,
    "$battlecreekenquirer": battlecreekenquirer,
    "$livingstondaily": livingstondaily,
    "$thetimesherald": thetimesherald
  },
  "mixins": {
    "sites": function() {
      return {
        ".freep": {
          "background-color": freep
        },
        ".detroitnews": {
          "background-color": detroitnews
        },
        ".lansingstatejournal": {
          "background-color": lansingstatejournal
        },
        ".hometownlife": {
          "background-color": hometownlife
        },
        ".battlecreekenquirer": {
          "background-color": battlecreekenquirer
        },
        ".thetimesherald": {
          "background-color": thetimesherald
        },
        ".livingstondaily": {
          "background-color": livingstondaily
        }
      }
    }
  }
};
