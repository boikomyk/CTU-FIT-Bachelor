import {
  RECEIVE_FOLLOWING_STRATEGIES,
  SET_FOLLOWING_STRATEGIES,
  RESET_FOLLOWING_STRATEGIES,
  UPDATE_FOLLOWING_STRATEGIES
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
export default function followingStrategiesReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case RESET_FOLLOWING_STRATEGIES:
      return initialState;
    case SET_FOLLOWING_STRATEGIES:
      return {
        ...state,
        strategies: action.strategies,
        loaded: false
      };
    case RECEIVE_FOLLOWING_STRATEGIES:
      return {
        ...state,
        loaded: action.loaded
      };
    case UPDATE_FOLLOWING_STRATEGIES:
      return {
        ...state,
        strategies: action.strategies
      };
    default:
      return state;
  }
}
