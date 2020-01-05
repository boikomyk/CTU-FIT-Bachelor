import axios from 'axios';
import { UNAUTHORIZED } from 'http-status-codes';
import store from 'store/Store';
import { logout } from 'actions/login/Login';

const client = axios.create({
  baseURL: process.env.REACT_APP_HOST
});

/**
 * @param {Object} options
 * @return {Promise}
 */
const rest = function(options) {
  const onSuccess = function(response) {
    return response.data !== '' ?
      response
      : Promise.reject(error.response || error.message);
  };

  const onError = function(error) {
    if (error.response.status === UNAUTHORIZED) {
      // store.dispatch(logout());
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default rest;
