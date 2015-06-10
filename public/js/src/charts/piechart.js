import _map from 'lodash/collection/map';
import d3 from 'd3';


// For reference - http://bl.ocks.org/dbuezas/9306799
export default class PieChart {
  /**
   * Draw data in [data] to the DOM element specified by [element]
   *
   * @constructs
   * @param {Array} [data] Array of objects that hold the data
   * @param {Object} [element] DOM object where the data should be drawn
   */
  constructor(data, element) {
    element.innerHTML = '';

    this.data = data;
    this.names = _map(this.data, function(d) {
      return d.label;
    });

    this.element = element;
    this.svg = d3.select(element)
      .append('svg')
      .append('g');

    this.initChart();

    // Window resize event
    d3.select(window).on('resize', this.initChart.bind(this));
  }

  initChart() {
    this.svg.append('g')
      .attr('class', 'slices');
    this.svg.append('g')
      .attr('class', 'labels');
    this.svg.append('g')
      .attr('class', 'lines');

    let width = this.width = this.element.scrollWidth;
    let height = this.height = this.element.scrollHeight;
    let radius = this.radius = Math.min(width, height) / 2;

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    this.arc = d3.svg.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    this.outerArc = d3.svg.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    this.svg.attr('transform', `translate(${width/2}, ${height/2})`);
    this.key = function(d) { return d.data.label; };

    // TODO this was taken from http://bl.ocks.org/dbuezas/9306799, make
    // this apply to my needs
    this.color = d3.scale.ordinal()
      .domain(this.names)
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);//, "#a05d56", "#d0743c", "#ff8c00"]);

    this.loadData();
  }

  loadData() {
    let data = this.data;
    let that = this;

    /* Slices */
    let slice = this.svg.select('.slices').selectAll('path.slice')
      .data(this.pie(data), this.key);

    slice.enter()
      .insert('path')
      .style('fill', function(d) { return that.color(d.data.label); });

    slice
      .transition().duration(1000)
      .attrTween('d', function(d) {
        this._current = this._current || d;
        let interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return that.arc(interpolate(t));
        };
      });

    slice.exit()
      .remove();

    /* Text Label */
    let text = this.svg.select('.labels').selectAll('text')
      .data(this.pie(data), this.key);

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .text(function(d) {
        return d.data.label;
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween('transform', function(d) {
        this._current = this._current || d;
        let interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);

        return function(t) {
          let d2 = interpolate(t);
          let pos = that.outerArc.centroid(d2);
          pos[0] = that.radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        }
      })
      .styleTween('text-anchor', function(d) {
        this._current = this._current || d;
        let interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);

        return function(t) {
          let d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start' : 'end';
        }
      });

    text.exit()
      .remove();

    /* Slice to text polylines */
    let polyline = this.svg.select('.lines').selectAll('polyline')
      .data(this.pie(data), this.key);

    polyline.enter()
      .append('polyline');

    polyline.transition().duration(1000)
      .attrTween('points', function(d) {
        this._current = this._current || d;
        let interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);

        return function(t) {
          let d2 = interpolate(t);
          let pos = that.outerArc.centroid(d2);
          pos[0] = that.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [that.arc.centroid(d2), that.outerArc.centroid(d2), pos];
        }
      });

    polyline.exit()
      .remove();
  }
}