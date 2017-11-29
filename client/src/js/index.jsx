import './index.scss';
import './index.css';

import {
  RESIZE,
  STYLE_REQUEST,
  SETTINGS_REQUEST,
  COPY_REQUEST,
  PREMIUM_PARTNER_REQUEST
} from 'actions/actionTypes';

import { throttle } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { calculateResponsiveState } from 'redux-responsive';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { createBrowserHistory, createHashHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router/immutable';

import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from 'store/configureStore';

import { Router } from 'react-router-dom';

import AppPageMediator from 'mediators/AppPageMediator';

// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

function logout(nextState, replaceState) {
  Auth.deauthenticateUser();
  replaceState(null, '/login');
}

// Configure store and routes
const browserHistory = createBrowserHistory();
const store = configureStore({
  browserHistory
});

const throttleResize = throttle(() => {
  store.dispatch({ type: RESIZE });
  store.dispatch(calculateResponsiveState(window));
}, 400);
window.addEventListener('resize', () => throttleResize());

store.dispatch({ type: COPY_REQUEST });
store.dispatch({ type: SETTINGS_REQUEST });
//load custom styles
//TODO
//store.dispatch({type: STYLE_REQUEST})
//store.dispatch({type: PREMIUM_PARTNER_REQUEST})

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <AppPageMediator />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
