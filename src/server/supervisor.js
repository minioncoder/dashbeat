'use strict';

import debug from 'debug';
var logger = debug('app:supervisor-api');
import xmlrpc from 'xmlrpc';

export default class SupervisorApi {
  constructor(host, port, user, pass) {
    this.client = xmlrpc.createClient({
      path: '/RPC2',
      host, port,
      basic_auth: {
        user, pass
      }
    });
  };

  info() {
    return new Promise((resolve, reject) => {
      this.client.methodCall("supervisor.getAllProcessInfo", [], function(err, procs) {
        if (err) reject(err);
        resolve(procs);
      });
    });
  };
};
