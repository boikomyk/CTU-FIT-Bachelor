import { combineReducers } from 'redux';

import notificationReducer from 'reducers/notification/Notification';
import alertReducer from 'reducers/alert/Alert';

import loginReducer from 'reducers/login/Login';
import registerReducer from 'reducers/register/Register';

import profileReducer from 'reducers/profile/Profile';
import walletReducer from 'reducers/wallet/Wallet';
import strategyReducer from 'reducers/strategy/Strategy';
import strategiesReducer from 'reducers/strategies/Strategies';
import strategyEditReducer from 'reducers/strategyEdit/StrategyEdit';
import userStrategiesReducer from 'reducers/userStrategies/UserStrategies';
import followingStrategiesReducer from 'reducers/followingStrategies/FollowingStrategies';
import signalsReducer from 'reducers/signals/Signals';
import websocketReducer from 'reducers/websocket/Websocket';
import { RESET_STORE } from 'constants/ActionTypes';
import { getAccessToken, isAccessTokenSet } from 'helpers/ls/LocalStorage';
import { reducer as notificationsReducer } from 'reapop';

export const initialState = {
  login: {
    authenticated: isAccessTokenSet(),
    token: getAccessToken(),
    loaded: true
  },
  register: {
    loaded: true
  }
};
export const appReducer = combineReducers({
  notifications: notificationsReducer(),
  websocket: websocketReducer,
  strategyEdit: strategyEditReducer,
  signals: signalsReducer,
  userStrategies: userStrategiesReducer,
  followingStrategies: followingStrategiesReducer,
  alert: alertReducer,
  strategy: strategyReducer,
  strategies: strategiesReducer,
  wallet: walletReducer,
  notification: notificationReducer,
  login: loginReducer,
  register: registerReducer,
  profile: profileReducer
});

export const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) return appReducer(initialState, action);
  return appReducer(state, action);
};
