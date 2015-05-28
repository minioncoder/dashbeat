'use strict';

import io from 'socket.io-browserify';

export default class DashSocket {
  constructor(events, { ondisconnect } = {}) {
    Object.assign(this, { events });
    this.rooms = {};
    this.socket = io.connect();
    this.emit(events);
    this.dc(ondisconnect);
  }

  emit(events) {
    if (typeof events === 'undefined') events = this.events;

    if (!Array.isArray(events)) {
      events = [events];
    }

    for (let i = 0; i < events.length; i++) {
      let _event = events[i];
      this.socket.emit(_event);
      if (!this.rooms.hasOwnProperty(_event)) {
        this.rooms[_event] = new Room(this.socket, _event);
      }
    }
  }

  dc(dcb) {
    if (typeof dcb === 'undefined') {
      dcb = data => {
        this.log('You were disconnected from the socket');
        this.log('Attempting to reconnect to socket ...');
        this.socket.socket.reconnect();
        this.emit();
      };
    }
    this.socket.on('disconnect', dcb);
  }

  room(name) {
    return this.rooms[name];
  }

  log(msg) {
    console.log(new Date().toString() + ': ' + msg);
  }
}

class Room {
  constructor(socket, name) {
    Object.assign(this, { socket, name });
  }

  on(event_name, cb) {
    this.socket.on(this.name + '-' + event_name, cb);
  }
}