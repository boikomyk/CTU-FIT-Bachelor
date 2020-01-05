import RegisterApi from 'resources/rest/Register';

import { RECEIVE_REGISTER } from 'constants/ActionTypes';
import { pushNotification } from 'actions/notification/Notification';
import AlertCircle from 'mdi-material-ui/AlertCircle';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import * as HttpStatus from 'http-status-codes';
import { pushAlert } from 'actions/alert/Alert';
import history from 'helpers/history/History';

/**
 * @return {Object}
 */
export function receiveRegister(loaded) {
  return {
    type: RECEIVE_REGISTER,
    loaded
  };
}

/**
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @return {Promise}
 */
export const register = (username, email, password) => dispatch => {
  dispatch(receiveRegister(false));
  return RegisterApi.register(username, email, password)
    .then(response => {
      dispatch(receiveRegister(true));
      dispatch(
        pushAlert(
          'Almost there!',
          'We\'ve sent you an email with instructions on the email address ' +
            email +
            '. Click on the link in email and activate your account.',
          'success',
          () => {
            history.push('/login');
          }
        )
      );
    })
    .catch(response => {
      if (response.status === HttpStatus.CONFLICT) {
        dispatch(
          pushNotification(
            <div>
              {'This email or username is already in use. '}
              <Link
                color='inherit'
                to={{pathname: '/login'}}
                component={RouterLink}
              >
                <b>{'Log In?'}</b>
              </Link>
            </div>,
            'danger',
            AlertCircle
          )
        );
      }
      dispatch(receiveRegister(true));
    });
};

/**
 * @param {String} username
 * @param {String} token
 * @return {Promise}
 */
export const confirmEmail = (username, token) => dispatch => {
  return RegisterApi.confirmEmail(username, token)
    .then(response => {
      dispatch(
        pushAlert(
          'Account successfully verified!',
          'You can now use your account to log in.',
          'success',
          () => {
            history.push('/login');
          }
        )
      );
    })
    .catch(response => {
      if (response.status === HttpStatus.NOT_FOUND) {
        dispatch(
          pushNotification(
            'Confirming email address failed. Please try again later.',
            'danger',
            AlertCircle
          )
        );
      }
    });
};
