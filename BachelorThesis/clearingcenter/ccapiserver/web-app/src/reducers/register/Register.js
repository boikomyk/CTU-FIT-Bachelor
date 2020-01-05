import { RECEIVE_REGISTER } from 'constants/ActionTypes';

const initialState = {
  loaded: false
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function registerReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_REGISTER:
      return {
        ...state,
        loaded: action.loaded
      };

    default:
      return state;
  }
}
