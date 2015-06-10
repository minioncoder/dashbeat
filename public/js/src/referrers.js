
import _each from 'lodash/collection/forEach';

import Framework from './framework/index';
import DashSocket from './lib/socket';
import Referrer from './jsx/referrer/referrer.jsx';
import d3 from 'd3';
import { parseReferrer } from './lib/parse'

// Size the SVG element
function getReferrerHeight() {
  var windowHeight = window.innerHeight;
  var containerTop = referrersContainer.offsetTop;
  if (windowHeight <= containerTop) return;

  return windowHeight - containerTop - 5;
}

/**
 *  Referrers - Keeps track of all instances of the Referrer class that we have
 *
 *  @class
 */
class Referrers {
  /**
   * @constructs
   */
  constructor(referrersContainer) {
    this.referrers = {};
    this.referrersContainer = referrersContainer
    this.svg = d3.select('.referrers');
    this.color = d3.scale.category20c();
  }


  /**
   * Generates the d3.layout.pack() based on the current size of the screen
   * @memberof Referrers#
   */
  bubble() {
    var height = getReferrerHeight();
    var width = window.innerWidth;
    return d3.layout.pack()
      .sort(null)
      .size([width, height])
      .padding(1.5);
  }

  /**
   * Add a total [value] for a given Referrer [referrer] for a host site [host]
   * @memberof Referrers#
   * @param {String} [referrer] Referring site (e.g. t.co)
   * @param {String} [host] Host site that got referrered (e.g. freep.com)
   * @param {Number} [value] Number of referrals to [host] from [referrer]
   */
  addReferrer(referrer, host, value) {

    referrer = parseReferrer(referrer);
    if (!(referrer in this.referrers)) {
      // Create the Referrer instance
      this.referrers[referrer] = new Referrer(referrer);
    }

    this.referrers[referrer].addHost(host, value);
  }

  /**
   * For the top [limit] number of Referrers in sortedResults, add up their totals
   * Used to calculate size percentages for drawn svg elements
   * @memberof Referrers#
   * @param {Array} [sortedResults] An array of Referral objects, sorted by referral numbers
   * @param {Number} [limit] Number of Referrals in [sortedResults] that will be drawn
   */
  getTopReferrerTotal(sortedResults, limit=15) {
    let total = 0;
    for (let i = 0; i < limit; i++) {
      total += sortedResults[i].value;
    }
    return total;
  }

  /**
   * Draw/update the drawn referrers. Iterate over the referrers in this.referrers
   * and draw the top [limit] referrers
   */
  draw(limit=15) {
    var totals = [];
    _each(this.referrers, function(referrer, name) {
      // if (referrer.name === DARK_SOCIAL) return;
      totals.push({
        referrer,
        value: referrer.getTotal()
      })
    });

    totals = totals.sort(function(a, b) {
      return parseInt(b.value) - parseInt(a.value);
    });

    this.referrersContainer.innerHTML = '';
    referrersContainer.style.height = getReferrerHeight() + 'px';

    var node = this.svg.selectAll('.referrer')
      .data(this.bubble().nodes({
        children: totals.slice(0, limit)
      })
        .filter(function(d) { return !d.children; }))
      .enter().append('g')
        .attr('class', 'referrer')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    node.append('title')
      .text(function(d) { return d.referrer.name; });

    node.append('circle')
      .attr('r', function(d) { return d.r; })
      .style('fill', (d) => { return this.color(d.referrer.name); });

    node.append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(function(d) { return `${d.referrer.name.substring(0, d.r / 3)}: ${d.value}`; });
  }
}

var referrersContainer = document.getElementsByClassName('referrers')[0];
var referrers = new Referrers(referrersContainer);

var dash = new DashSocket('referrers');
dash.room('referrers').on('data', function(data) {
  console.log(data);
  // Iterate over each host in the returned data
  _each(data, function(values, host) {

    // Now iterate over each referrer for this host
    _each(values, function(value, referrer) {

      referrers.addReferrer(referrer, host, value);
    });
  });
  referrers.draw();
});