/** Used for common things across all pages (e.g. navbar, etc) */

import $ from 'domtastic';
import Velocity from 'velocity-animate';

class Navbar {
  constructor() {
    this.selectors = {
      menuToggle: '.menu-toggle',
      dashboardMenu: '.dashboards',
      dashboardOption: '.dashboards .option'
    }

    this.initHandlers();

    this.animating = false;
  }

  initHandlers() {
    $('body').on('click', this.selectors.menuToggle, e => {

      if (this.animating) return;

      this.animating = true;

      let height = 1;
      let callback;
      if (!$(this.selectors.dashboardMenu).hasClass('show')) {
        $(this.selectors.dashboardMenu).addClass('show');
        let $options = $(this.selectors.dashboardOption)
        height = $options.length * $options[0].scrollHeight;
        callback = () => {
          this.animating = false;
        };
      }
      else {
        callback = () => {
          $(this.selectors.dashboardMenu).toggleClass('show');
          this.animating = false;
        }
      }

      Velocity($(this.selectors.dashboardMenu), {
        height: height
      }, callback);

    });
  }
}

module.exports = {
  navbar: new Navbar()
}