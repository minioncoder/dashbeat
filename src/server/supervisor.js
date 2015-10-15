'use strict';

import debug from 'debug';
var logger = debug('app:supervisor-api');
import xmlrpc from 'xmlrpc';

var default_methods = [
  'supervisor.addProcessGroup',
  'supervisor.clearAllProcessLogs',
  'supervisor.clearLog',
  'supervisor.clearProcessLog',
  'supervisor.clearProcessLogs',
  'supervisor.getAPIVersion',
  'supervisor.getAllConfigInfo',
  'supervisor.getAllProcessInfo',
  'supervisor.getIdentification',
  'supervisor.getPID',
  'supervisor.getProcessInfo',
  'supervisor.getState',
  'supervisor.getSupervisorVersion',
  'supervisor.getVersion',
  'supervisor.readLog',
  'supervisor.readMainLog',
  'supervisor.readProcessLog',
  'supervisor.readProcessStderrLog',
  'supervisor.readProcessStdoutLog',
  'supervisor.reloadConfig',
  'supervisor.removeProcessGroup',
  'supervisor.restart',
  'supervisor.sendProcessStdin',
  'supervisor.sendRemoteCommEvent',
  'supervisor.shutdown',
  'supervisor.startAllProcesses',
  'supervisor.startProcess',
  'supervisor.startProcessGroup',
  'supervisor.stopAllProcesses',
  'supervisor.stopProcess',
  'supervisor.stopProcessGroup',
  'supervisor.tailProcessLog',
  'supervisor.tailProcessStderrLog',
  'supervisor.tailProcessStdoutLog',
  'system.listMethods',
  'system.methodHelp',
  'system.methodSignature',
  'system.multicall'
];

export default class SupervisorApi {
  constructor(host, port, user, pass, methods=default_methods) {
    this.createMethods(methods);
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
      this.getAllProcessInfo(function(err, procs) {
        if (err) reject(err);
        resolve(procs);
      });
    });
  };

  createMethods(methods) {
    let that = this;
    for (let i = 0; i < methods.length; i++) {
      let method = methods[i];
      this[method.split('.').pop()] = function(...args) {
        let callback = args.pop();
        that.client.methodCall(method, args, callback);
      };
    }
  };
}
