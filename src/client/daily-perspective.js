import Framework from './framework/index';
// import DashSocket from './lib/socket';
import Dashboard from './dashboards/daily-perspective/dashboard';
import request from 'request';

let dashboard = new Dashboard();
dashboard.fetchData();