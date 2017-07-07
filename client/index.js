import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { connectRoutes, NOT_FOUND } from 'redux-first-router';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';

import App from './components/App.js';

const history = createHistory();

const routesMap = {
  HOME: '/home',      // action <-> url path
  USER: '/user/:id',  // :id is a dynamic segment
};

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap); // yes, 3 redux aspects

const userIdReducer = (state = null, action = {}) => {
  switch(action.type) {
  case 'HOME':
  case NOT_FOUND:
    return null;
  case 'USER':
    return action.payload.id;
  default:
    return state;
  }
};

const rootReducer = combineReducers({ location: reducer, userId: userIdReducer });
const middlewares = applyMiddleware(middleware);
const store = createStore(rootReducer, compose(enhancer, middlewares));

window.store = store;

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));
