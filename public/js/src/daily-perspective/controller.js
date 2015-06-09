import _each from 'lodash/collection/forEach';

import $ from '../framework/$';
import Host from './host';
import HostSelector from './jsx/hostSelector.jsx';

export default class Controller {
  /**
   * @constructs
   */
  constructor() {
    this.hosts = {};
    this.doneIniting = false;
    this.activeHost = undefined;
    this.activeHostName = '';
  }

  /**
   * Inits the instance of the controller. Sets handlers, etc
   *
   * @memberof Controller#
   * @param {Object} [data] Data from Reports socket, used to iterate and find hosts
   */
  init(data) {
    let hosts = [];
    _each(data, (stats, hostName) => {
      this.createHost(hostName, stats);
      hosts.push(hostName);
    });

    // Set up the host selector dropdown
    HostSelector(hosts, this);

    this.doneIniting = true;
  }

  /**
   * When the host selector dropdown changes host, set the active host
   *
   * @memberof Controller#
   * @param {String} [hostName] Name of host, whose data will be displayed
   */
  hostChange(hostName) {
    if (!(hostName in this.hosts)) return;

    if (this.activeHost) this.activeHost.deactivate();

    this.activeHost = this.hosts[hostName];
    this.activeHostName = hostName;
    console.log(`New host change: ${this.activeHostName}`);
    this.activeHost.activate();
  }

  /**
   * Creates a Host object with the name @param host in this.hosts
   *
   * @memberof Controller#
   * @param {String} [hostName] Name of host (e.g. freep.com)
   * @param {Object} [stats] Response data from API call for the given [hostName]
   *
   */
  createHost(hostName, stats) {
    this.hosts[hostName] = new Host(hostName, stats);
  }

  /**
   * Handle the response from the 'reports' socket. Iterate over all the hosts
   * and collect the data, passing it to each Host object
   *
   * @memberof Controller#
   * @param {Object} [data] Object maping host names to return API data
   */
  updateData(data) {
    if (!this.doneIniting) this.init(data);

    _each(data, (stats, hostName) => {
      if (!(hostName in this.hosts)) this.createHost(hostName);

      this.hosts[hostName].updateData(stats);

    });
  }
}