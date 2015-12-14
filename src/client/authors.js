'use strict';

import io from 'socket.io-client';
import d3 from 'd3';
import assing from 'object-assign';

import Screen from './lib/screen';
import { sourceColor } from './lib';
import Config from '../../config';

var MAX_AUTHORS = 30;
var socket = io(Config.socketUrl, {transports: ['websocket', 'xhr-polling']});

document.addEventListener('DOMContentLoaded', function() { init(); });

function init() {
  var margin = {
    'top': 10,
    'bottom': 70,
    'left': 10,
    'right': 10,
  };

  var screen = Screen(window, document);
  var width = screen.width - margin.left - margin.right;
  var height = screen.height - margin.top - margin.bottom;
  var treemap = d3.layout.treemap()
      .size([width, height])
      .value(function(d) { return d.totalVisits; })
      .sticky(false);

  // primary treemap container
  var div = d3.select('#author-treemap')
      .append('div')
      .style('position', 'relative')
      .style('width', width + 'px')
      .style('height', height + 'px')
      .style('left', margin.left + 'px')
      .style('top', margin.top + 'px');

  socket.emit('get_popular');
  socket.on('got_popular', function(data) {
    var articles = data.snapshot.articles;
    var authors = sortAuthors(articles);

    var node_el = div.selectAll('.node');
    // update existing author node text if exists
    node_el.html(nodeHtml);
    // create new author nodes with new data
    var nodes = node_el
        .data(treemap.nodes(authors), function(d) { return d.name; });
    nodes.enter().append('div')
      .attr('class', 'node')
      .html(nodeHtml);

    // remove old author nodes
    nodes.exit().remove();
    // create smooth transition effect
    nodes.transition().duration(1500)
      .call(position)
      .style('background', function(d) { return colorMixer(d); })
      .style('color', function(d) {
          return '#fff';
      });

    nodes.on('click', function(el) {
      showModal(el);
    });

    // adjust font size based on the width of the node
    for (let i = 0; i < node_el[0].length; i++) {
      let el = node_el[0][i];

      let node_width = window
        .getComputedStyle(el)
        .width
        .replace("px", "");
      node_width = parseInt(node_width);

      if (node_width <= 70) {
        el.style.fontSize = '12px';
      } else if (node_width > 70 && node_width < 110) {
        el.style.fontSize = '14px';
      } else if( node_width > 240) {
        el.style.fontSize = '24px';
      } else {
        el.style.fontSize = '18px';
      }
    }
  });
}

function colorMixer(obj) {
  let color = sourceColor(obj.source);
  if (obj.source != "usatoday") return color;

  let blueColors = [
    '#0F6EB1',
    '#085286',
    '#2A70A2'
  ];

  let charCode = obj.name.charCodeAt(0);
  if (charCode <= 104) return blueColors[0];
  else if (charCode <= 113) return blueColors[1];
  else if (charCode <= 120) return blueColors[2];

  return color;
}

function isWhitelistedUrl(url) {
  if (url == '') return false;

  let whitelist = ['story/', 'article/', 'picture-gallery/', 'longform/'];

  for (let i = 0; i < whitelist.length; i++) {
    let path = whitelist[i];
    if (url.indexOf(path) >= 0) return true;
  }

  return false;
}

function isBlacklistedAuthor(author) {
  author = author.toLowerCase();
  let blacklist = [
    'usa today',
    'associated press',
    'ap'
  ];

  for (let i = 0; i < blacklist.length; i++) {
    if (author.indexOf(blacklist[i]) >= 0) return true;
  }

  return false;
}

/**
 * HTML that resides in an authors node
 */
function nodeHtml(data) {
  return data.children ? null : `<p>${ data.name }</p> <span class='badge'>${ data.totalVisits }</span>`;
}

function position() {
  this.style('left', function(d) { return d.x + 'px'; })
      .style('top', function(d) { return d.y + 'px'; })
      .style('width', function(d) { return Math.max(0, d.dx - 1) + 'px'; })
      .style('height', function(d) { return Math.max(0, d.dy - 1) + 'px'; });
};

function authorCleanup(author) {
  author = author.trim();
  author = author.toLowerCase();
  author = author.replace('by', '');
  author = author.replace('the', '');
  author = author.replace('| photos', '');
  author = author.replace('video ', '');
  author = author.replace('story ', '');
  let and = author.indexOf('and ');
  if (and === 0) author = author.slice(and + 4);
  return author;
}

function getMapValue(curVal, val) {
  if (!curVal) return val;
  curVal.articles = curVal.articles.concat(val.articles);
  curVal.totalVisits += val.totalVisits;
  return curVal;
}

function sortAuthors(articles) {
  var authors = new Map();

  for (let i = 0; i < articles.length; i++) {
    let article = articles[i];

    if (!isWhitelistedUrl(article.url)) continue;

    let show_detroit = false;
    if (location.search) {
      show_detroit = location.search.match(new RegExp('detroit' + '=(.*?)($|\&)', 'i'))[1];
    }

    if (!show_detroit && (article.source == 'freep' || article.source == 'detroitnews')) continue;

    for (let i = 0; i < article.authors.length; i++) {
      let author = article.authors[i];
      author = authorCleanup(author);

      if (isBlacklistedAuthor(author)) continue;

      authors.set(author, getMapValue(authors.get(author), {
        name: author,
        source: article.source,
        articles: [article],
        totalVisits: article.visits
      }));
    }
  }

  var auths = [...authors.values()].sort(function(a, b) {
    return b.totalVisits - a.totalVisits;
  });

  auths = auths.slice(0, MAX_AUTHORS);

  return {
    children: auths,
    name: 'authors'
  };
}

/* Modal */

/**
 * @param {Object} el - d3 element
 */
function showModal(el) {

  let articles = [];
  for (let article of el.articles) {
    articles.push(`
      <div class='article'>
        <div class='viewers'><div class='badge'>${article.visits}</div></div>
        <div class='title'><a target='_blank' href='http://${article.url}'>${article.headline}</a></div>
      </div>`)
  }
  let html = `
<div class='author-summary'>
  <div class='author-name'>${ el.name }</div>
  <div class='total'>Total: <div class='badge'>${ el.value }</div></div>
  <div class='articles'>${ articles.join('') }</div>
</div>`
  let modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = html;

  let modal = document.getElementById('modal');
  let className = modal.className.replace('show', '') + ' show';
  modal.className = className;
}

function closeModal() {
  let modal = document.getElementById('modal');
  modal.className = modal.className.replace('show', '');
}

let modal = document.getElementById('modal');
modal.addEventListener('click', function(e) {
  let id = e.target.getAttribute('id');
  if (id == 'modal' || id == 'close-modal') closeModal();
});

