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

  updateQuickstats(snapshot) {
    store.quickstats = snapshot;
    this.emit(CHANGE_EVENT, store);
  },

  updateArticles(snapshot) {
    store.toppages = snapshot;
    this.emit(CHANGE_EVENT, store);
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

