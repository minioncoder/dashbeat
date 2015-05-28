'use strict';

function announceCallback(data) {
  console.log(data.message + new Date().toString());
}

function disconnectCallback(data) {
  console.log('You were disconnected from the socket');
}

export default class DashSocket {
  constructor(socket, event) {
    Object.assign(this, { socket, event });
    socket.emit(event);
    this.announce();
    this.protocol();
  }

  on(event_name, cb) {
    this.socket.on(event_name, cb);
  }

  announce(cb=announceCallback) {
    this.socket.on('announce', cb);
  }

  protocol(cb=disconnectCallback) {
    this.socket.on('disconnect', cb);
  }

  announceCallback(data) {
    console.log(data.message + new Date().toString());
  }

  disconnectCallback(data) {
    console.log('You were disconnected from the socket');
    this.socket.socket.reconnect();
  }
}