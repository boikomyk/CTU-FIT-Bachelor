import {
  RECEIVE_STRATEGIES,
  SET_STRATEGIES,
  RESET_STRATEGIES
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
export default function strategiesReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_STRATEGIES:
      return initialState;
    case SET_STRATEGIES:
      return {
        ...state,
        strategies: action.strategies,
        loaded: false
      };
    case RECEIVE_STRATEGIES:
      return {
        ...state,
        loaded: action.loaded
      };
    default:
      return state;
  }
}
