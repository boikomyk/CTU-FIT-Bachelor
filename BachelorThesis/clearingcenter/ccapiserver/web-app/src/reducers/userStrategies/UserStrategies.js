import {
  RECEIVE_USER_STRATEGIES,
  SET_USER_STRATEGIES,
  RESET_USER_STRATEGIES
} from 'constants/ActionTypes';

const initialState = {
  loaded: false,
  strategies: []
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function userStrategiesReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_USER_STRATEGIES:
      return initialState;
    case SET_USER_STRATEGIES:
      return {
        ...state,
        strategies: action.strategies,
        loaded: false
      };
    case RECEIVE_USER_STRATEGIES:
      return {
        ...state,
        loaded: action.loaded
      };
    default:
      return state;
  }
}
