import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { connectRoutes, NOT_FOUND } from 'redux-first-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import * as Immutable from 'immutable';
import createHistory from 'history/createBrowserHistory';

import App from './components/App.js';

const history = createHistory();

const routesMap = {
  HOME: '/',      // action <-> url path
  USER_INDEX: '/user',
  USER: '/user/:id',  // :id is a dynamic segment
  ABOUT: '/about',
};

/**
 * Is there a better way to do pages? This works just fine, and I rather like
 * it, but it still feels like I might be thinking in terms of the old ways.
 * Like a RR config with a number of Route component siblings at the top level.
 */
const userIdReducer = (state = null, action = {}) => {
  switch(action.type) {
  case 'HOME':
  case NOT_FOUND:
    return null;
  case 'USER':
    return action.payload.id;

  // This might not be necessary. I was having issues getting the app to do
  // double duty by displaying user index when there was no user id. However,
  // that bug might have been related to the Link component and not my app. For
  // now, this is one way to have index pages.
  case 'USER_INDEX':
    return null;

  default:
    return state;
  }
};

const page = (state = 'HOME', action) => {
  switch (action.type) {
  case 'HOME':
    return 'HOME';
  case 'ABOUT':
    return 'ABOUT';
  case 'USER':
  case 'USER_INDEX':
    return 'USER';
  case NOT_FOUND:
    return null;
  default:
    return state;
  }
};

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap, {
  selectLocationState: state => toJS(state.get('location')),
});

// A toJS function you can call on anything
const toJS = x => {
  if (x && typeof x.toJS === 'function') {
    return x.toJS();
  } else {
    return x;
  }
};

// Wrap a non-immutable reducer to make it compatible with an immutable state.
// This may not be necessary but it's worth noting that without it we are
// storing a plain javascript object within the larger immutable map
const wrapReducer = (innerReducer) => (state, action) => {
  return Immutable.fromJS(innerReducer(toJS(state), action));
};

const rootReducer = combineReducers({ location: reducer, userId: userIdReducer, page });
const middlewares = applyMiddleware(middleware, logger);
const store = createStore(rootReducer, compose(enhancer, middlewares));

function exposeGlobals(root, globals = {}) {
  Object.assign(root, globals);
  window.Immutable = Immutable;
}

if (process.env.NODE_ENV === 'development') {
  exposeGlobals(window, { store });
}

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));
