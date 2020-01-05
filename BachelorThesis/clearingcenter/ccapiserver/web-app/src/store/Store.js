import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import history from 'helpers/history/History';
import { initialState, rootReducer } from 'reducers/Reducers';
import { websocket } from 'middleware/Websocket';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
let enhancer;

if (process && process.env && process.env.NODE_ENV === 'development') {

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(promise),
    applyMiddleware(logger),
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(websocket)
  );
} else {
  enhancer = composeWithDevTools(
    applyMiddleware(websocket),
    applyMiddleware(thunk),
    applyMiddleware(promise),
    applyMiddleware(routerMiddleware(history))
  );
}

export default createStore(
  connectRouter(history)(rootReducer),
  initialState,
  enhancer
);
