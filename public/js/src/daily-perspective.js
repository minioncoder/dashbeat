import Framework from './framework/index';
import DashSocket from './lib/socket';
import Controller from './dashboards/daily-perspective/controller';

let dash = new DashSocket(['reports']);
let controller = new Controller();
dash.room('reports').on('data', function(data) {
  controller.updateData(data);
});