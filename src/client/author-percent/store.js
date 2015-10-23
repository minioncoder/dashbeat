'use strict';

import { EventEmitter } from 'events';

import { Dispatcher } from 'flux';
import assign from 'object-assign';

let dispatcher = new Dispatcher();
let store = defaultStore();

dispatcher.register(function(data) {
  switch (data.type) {
    case actionTypes.QUICKSTATS:
      AuthorPercentStore.updateQuickstats(data.snapshot);
      break;
    case actionTypes.TOPPAGES:
      AuthorPercentStore.updateArticles(data.snapshot);
      break;
    default:
      return;
  }
});

let actionTypes = {
  QUICKSTATS: 'quickstats',
  TOPPAGES: 'toppages'
};
let CHANGE_EVENT = 'change';
let CHANGE_EVENT_ID;
let TIMEOUT = 1000;

function defaultStore() {
  return {
    quickstats: {},
    toppages: {}
  }
}

export let AuthorPercentStore = assign({}, EventEmitter.prototype, {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange() {
    if (CHANGE_EVENT_ID)  window.clearTimeout(CHANGE_EVENT_ID);

    CHANGE_EVENT_ID = setTimeout(() => {
      this.emit(CHANGE_EVENT, store);
    }, TIMEOUT);
  },

  updateQuickstats(snapshot) {
    store.quickstats = snapshot;
    this.emitChange();
  },

  updateArticles(snapshot) {
    store.toppages = snapshot;
    this.emitChange();
  }
});


export let updateQuickstats = function(snapshot) {
  dispatcher.dispatch({
    type: actionTypes.QUICKSTATS,
    snapshot
  });
}

export let updateToppages = function(snapshot) {
  dispatcher.dispatch({
    type: actionTypes.TOPPAGES,
    snapshot
  });
}

