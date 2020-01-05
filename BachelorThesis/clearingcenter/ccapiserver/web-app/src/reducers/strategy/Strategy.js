import {
  RECEIVE_STRATEGY,
  SET_STRATEGY,
  UNSET_STRATEGY,
  SET_STRATEGY_SIGNALS,
  RECEIVE_STRATEGY_SIGNALS,
  SET_CANDLES,
  RECEIVE_CANDLES,
  FOLLOW_STRATEGY,
  SUBSCRIBE_STRATEGY,
  RESET_USER_STRATEGIES,
  RESET_STRATEGY
} from 'constants/ActionTypes';

import Strategy from 'models/Strategy';

const initialState = {
  strategy: new Strategy(),
  candlesLoaded: false,
  follow: false,
  subscribe: false,
  owns: false,
  signalsLoaded: false,
  strategyLoaded: false,
  signals: [],
  candles: []
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function strategyReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_STRATEGY:
      return initialState;
    case SET_STRATEGY:
      let owns = false;
      if (action.strategy.owns !== undefined && true === action.strategy.owns) {
        owns = true;
      }
      return {
        ...state,
        strategy: action.strategy,
        owns: owns,
        strategyLoaded: false,
        follow: action.strategy.follow,
        subscribe: action.strategy.subscribe
      };
    case UNSET_STRATEGY:
      return initialState;
    case FOLLOW_STRATEGY:
      state.strategy.follow = action.follow;
      state.follow = action.follow;
      return {
        ...state
      };
    case SUBSCRIBE_STRATEGY:
      state.strategy.subscribe = action.subscribe;
      state.subscribe = action.subscribe;
      return {
        ...state
      };

    case SET_CANDLES:
      return {
        ...state,
        candles: action.candles,
        candlesLoaded: false
      };
    case SET_STRATEGY_SIGNALS:
      return {
        ...state,
        signals: action.signals,
        signalsLoaded: false
      };
    case RECEIVE_CANDLES:
      return {
        ...state,
        candlesLoaded: action.loaded
      };
    case RECEIVE_STRATEGY:
      return {
        ...state,
        strategyLoaded: action.loaded
      };
    case RECEIVE_STRATEGY_SIGNALS:
      return {
        ...state,
        signalsLoaded: action.loaded
      };

    default:
      return state;
  }
}
