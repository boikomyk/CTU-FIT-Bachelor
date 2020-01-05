import {
  SET_LOGIN_TOKEN,
  REMOVE_LOGIN_TOKEN,
  RECEIVE_LOGIN_TOKEN
} from 'constants/ActionTypes';
import {
  getAccessToken,
  getAccessTokenHeader,
  isAccessTokenSet,
  removeAccessToken
} from 'helpers/ls/LocalStorage';

const initialState = {
  authenticated: isAccessTokenSet(),
  token: getAccessToken(),
  loaded: false
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_TOKEN:
      return {
        ...state,
        token: action.token,
        authenticated: true,
        loaded: false
      };

    case REMOVE_LOGIN_TOKEN:
      return {
        ...state,
        token: '',
        authenticated: false,
        loaded: true
      };
    case RECEIVE_LOGIN_TOKEN:
      return {
        ...state,
        loaded: action.loaded
      };

    default:
      return state;
  }
}
