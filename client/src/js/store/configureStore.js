import 'babel-polyfill';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import Reducers from 'reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'sagas';
import { createLogger } from 'redux-logger';
import { responsiveStoreEnhancer } from 'redux-responsive';
import promiseMiddleware from 'redux-promise-middleware';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

// TODO check this is only imported for development

const USE_DEV_TOOLS = process.env.DEV;

console.log(process.env.NODE_ENV);

/* http://redux.js.org/docs/api/applyMiddleware.html */
export default function configureStore(options = {}) {
  const { initialState = {}, browserHistory = {} } = options;

  const middlewares = [];

  const sagaMiddleware = createSagaMiddleware({
    logger: () => {}
  });

  middlewares.push(
    /*thunk,
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
    }),*/
    routerMiddleware(browserHistory),
    sagaMiddleware
  );

  if (USE_DEV_TOOLS) {
    middlewares.push(createLogger());
  }

  const store = createStore(
    connectRouter(browserHistory)(Reducers),
    initialState,
    composeWithDevTools(responsiveStoreEnhancer, applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
