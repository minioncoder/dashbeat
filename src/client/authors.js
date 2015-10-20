'use strict';

import io from 'socket.io-client';
import d3 from 'd3';
import Colorbrewer from 'colorbrewer';

import Screen from './lib/screen';

var MAX_AUTHORS = 30;
var socket = io('https://api.michigan.com', {transports: ['websocket', 'xhr-polling']});

document.addEventListener('DOMContentLoaded', function() { init(); });

function init() {
  var margin = {
    "top": 10,
    "bottom": 70,
    "left": 10,
    "right": 10,
  };

  var screen = Screen(window, document);
  var width = screen.width - margin.left - margin.right;
  var height = screen.height - margin.top - margin.bottom;
  var treemap = d3.layout.treemap()
      .size([width, height])
      .value(function(d) { return d.totalVisits; })
      .sticky(false);

  // background colors
  var color = d3.scale.ordinal()
                .range(Colorbrewer.Greens[9]);
  // primary treemap container
  var div = d3.select("#author_treemap")
      .append("div")
      .style("position", "relative")
      .style("width", width + "px")
      .style("height", height + "px")
      .style("left", margin.left + "px")
      .style("top", margin.top + "px");

  socket.emit('get_popular');
  socket.on('got_popular', function(data) {
    var articles = data.snapshot.articles;
    var authors = sortAuthors(articles);

    var node_el = div.selectAll(".node");
    // update existing author node text if exists
    node_el.html(nodeHtml);
    // create new author nodes with new data
    var nodes = node_el
        .data(treemap.nodes(authors), function(d) { return d.name; });
    nodes.enter().append("div")
      .attr("class", "node")
      .html(nodeHtml);
    // remove old author nodes
    nodes.exit().remove();
    // create smooth transition effect
    nodes.transition().duration(1500)
      .call(position)
      .style("background", function(d) { return sourceColor(d.source); })
      .style("color", function(d) {
          return "#fff";
      });

    // adjust font size based on the width of the node
    for (let i = 0; i < node_el.length; i++) {
      var el = node_el[i];
      var node_width = el.width;
      if (node_width <= 70) {
        this.style.fontSize = '12px';
      } else if (node_width > 70 && node_width < 110) {
        this.style.fontSize = '14px';
      } else if( node_width > 240) {
        this.style.fontSize = '24px';
      }
    }
  });
}

function sourceColor(source) {
  var map = {
    "freep": "#2095F2",
    "detroitnews": "#F34235",
    "lansingstatejournal": "#FEEA3A",
    "hometownlife": "#B3E9F8",
    "battlecreekenquirer": "#9800FE",
    "thetimesherald": "#8AC249",
    "livingstondaily": "#CD54B0"
  };

  return map[source];
}

/**
 * Picks the font color based on the background color of the node
 */
function fontColor(bg_color) {
  var dark_colors = [];
  if (dark_colors.indexOf(bg_color) != -1) {
    return "white";
  }
  return "black";
}

function isWhitelisted(url) {
  if (url == "") return false;

  let whitelist = ["story/", "article/", "picture-gallery/", "longform/"];

  for (let i = 0; i < whitelist.length; i++) {
    let path = whitelist[i];
    if (url.indexOf(path) >= 0) return true;
  }

  return false;
}

/**
 * HTML that resides in an authors node
 */
function nodeHtml(data) {
  return data.children ? null : "<p>" + data.name + "</p> <span class='badge'>" + data.totalVisits + "</span>";
}

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
};

function authorCleanup(author) {
  author = author.trim();
  author = author.toLowerCase();
  author = author.replace("by", "");
  author = author.replace("the", "");
  let and = author.indexOf("and ");
  if (and === 0) author = author.slice(and + 4);
  return author;
}

function getMapValue(cur_val, val) {
  if (!cur_val) return val;
  cur_val.articles.concat(val.articles);
  cur_val.totalVisits += val.totalVisits;
  return cur_val;
}

function copy(val) {
  return {
    name: val.name,
    source: val.source,
    articles: val.articles,
    totalVisits: val.totalVisits
  };
}

function sortAuthors(articles) {
  var authors = new Map();

  for (let i = 0; i < articles.length; i++) {
    let article = articles[i];

    if (!isWhitelisted(article.url)) continue;

    for (let i = 0; i < article.authors.length; i++) {
      let author = article.authors[i];
      author = authorCleanup(author);
      if (author == "") continue;

      let val = {
        name: author,
        source: article.source,
        articles: [article],
        totalVisits: article.visits
      };

      let multAuth = author.indexOf(" and ");
      if (multAuth == -1) {
        authors.set(author, getMapValue(authors.get(author), val));
      } else {
        let authOne = author.slice(0, multAuth).trim();
        val.name = authOne;
        authors.set(authOne, getMapValue(authors.get(authOne), val));

        let authTwo = author.slice(multAuth + 5).trim();
        let nval = copy(val);
        nval.name = authTwo;
        authors.set(authTwo, getMapValue(authors.get(authTwo), nval));
      }
    }
  }

  var auths = [...authors.values()].sort(function(a, b) {
    return b.totalVisits - a.totalVisits;
  });

  auths = auths.slice(0, MAX_AUTHORS);

  return {
    children: auths,
    name: "authors"
  };
}
