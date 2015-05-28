
import _each from 'lodash/collection/forEach';

import base from './lib/base';
import io from 'socket.io-browserify';
import Referrer from './jsx/referrer.jsx';
import d3 from 'd3';

var DIAMETER = 960;
var DARK_SOCIAL = 'dark social';
// Size the SVG element
function sizeReferrerContainer() {
  var windowHeight = window.innerHeight;
  var containerTop = referrersContainer.offsetTop;
  if (windowHeight <= containerTop) return;

  var restOfScreen = windowHeight - containerTop - 5;
  // referrersContainer.style.height = restOfScreen + 'px';
  referrersContainer.style.height = DIAMETER + 'px';
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
    this.bubble = d3.layout.pack()
      .sort(null)
      .size([DIAMETER, DIAMETER])
      .padding(1.5);
    this.color = d3.scale.category20c();

    sizeReferrerContainer();
  }

  /**
   * Add a total [value] for a given Referrer [referrer] for a host site [host]
   * @memberof Referrers#
   * @param {String} [referrer] Referring site (e.g. t.co)
   * @param {String} [host] Host site that got referrered (e.g. freep.com)
   * @param {Number} [value] Number of referrals to [host] from [referrer]
   */
  addReferrer(referrer, host, value) {
    // According to the API docs (https://chartbeat.com/docs/api/explore/#endpoint=live/referrers/v3/+host=gizmodo.com)
    // a referrer === '' is a result of direct traffic to the page
    //
    // TODO be smarter with this. We get like 10 different google sites (google.co, google.ca, etc),
    // so we can combine those and alot of others into one
    if (!referrer) {
      referrer = DARK_SOCIAL;
    }

    if (!(referrer in this.referrers)) {

      // Create the HTML
      // let circle = document.createElement('circle');
      // circle.id = referrer;
      // circle.className += 'referrer';
      // referrersContainer.appendChild(circle);

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
      if (referrer.name === DARK_SOCIAL) return;
      totals.push({
        referrer,
        value: referrer.getTotal()
      })
    });

    totals.sort(function(a, b) {
      return parseInt(b.total) - parseInt(a.total);
    });

    // var referralTotal = this.getTopReferrerTotal(totals, limit);

    // _each(totals, function(referrer, index) {
    //   let hide = index >= limit;
    //   if (hide) {
    //     referrer.hide();
    //   }
    //   else {
    //     referrer.draw();
    //   }
    // });
    this.referrersContainer.innerHTML = '';
    var node = this.svg.selectAll('.referrer')
      .data(this.bubble.nodes({
        children: totals.slice(0, limit)
      })
        .filter(function(d) { return !d.children; }))
      .enter().append('g')
        .attr('class', 'referrer')
        .attr('transform', function(d) {
          console.log(d);
          return 'translate(' + d.x + ',' + d.y + ')';
        });

    node.append('title')
      .text(function(d) {
        return d.referrer.name;
      });

    node.append('circle')
      .attr('r', function(d) { return d.r; })
      .style('fill', (d) => { return this.color(d.referrer.name); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.referrer.name.substring(0, d.r / 3); });
  }
}

let socket = io.connect();
let referrersContainer = document.getElementsByClassName('referrers')[0];
let referrers = new Referrers(referrersContainer);

socket.emit('referrers');
socket.on('referrers-data', function(data) {
  console.log(data);

  // Iterate over each host in the returned data
  _each(data, function(values, host) {

    // Now iterate over each referrer for this host
    _each(values, function(value, referrer) {

      referrers.addReferrer(referrer, host, value);
    });
  });
  // console.log(referrers.referrers);
  referrers.draw();
});