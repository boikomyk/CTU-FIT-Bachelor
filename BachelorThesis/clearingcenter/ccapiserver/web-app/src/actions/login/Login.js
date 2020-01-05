import _login from 'resources/rest/Login';

import {
  SET_LOGIN_TOKEN,
  REMOVE_LOGIN_TOKEN,
  RECEIVE_LOGIN_TOKEN,
  RESET_STORE
} from 'constants/ActionTypes';
import { setAccessToken, removeAccessToken } from 'helpers/ls/LocalStorage';
import { pushNotification } from 'actions/notification/Notification';
import AlertCircle from 'mdi-material-ui/AlertCircle';
import React from 'react';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { websocketDisconnect } from 'actions/websocket/Websocket';
import history from 'helpers/history/History';

/**
 * @param {String} token
 * @return {Object}
 */
export function setLoginToken(token) {
  return {
    type: SET_LOGIN_TOKEN,
    token
  };
}

/**
 * @param {Boolean} loaded
 * @return {Object}
 */
export function receiveToken(loaded) {
  return {
    type: RECEIVE_LOGIN_TOKEN,
    loaded
  };
}

/**
 * @return {Object}
 */
export function removeToken() {
  return {
    type: REMOVE_LOGIN_TOKEN
  };
}

/**
 * @return {Promise}
 */
export function resetStore() {
  return {
    type: RESET_STORE
  };
}

/**
 * @return {Promise}
 */
export const logout = () => dispatch => {
  removeAccessToken();
  dispatch(websocketDisconnect());
  history.push('/login');
  dispatch(resetStore());
  dispatch(pushNotification('You have been logged out.', 'info', ExitToApp));
};

/**
 * @param {String} email
 * @param {String} password
 * @return {Promise}
 */
export const login = (email, password) => dispatch => {
  dispatch(receiveToken(false));
  return _login(email, password)
    .then(response => {
      const token = response.headers['x-xsrf-token'];
      setAccessToken(token);
      dispatch(setLoginToken(token));
      dispatch(receiveToken(true));
    })
    .catch(response => {
      dispatch(receiveToken(true));
      dispatch(pushNotification(response.data.message, 'danger', AlertCircle));
    });
};
