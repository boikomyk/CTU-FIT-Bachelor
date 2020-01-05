import {
  EDITED_STRATEGY_LOADED,
  SET_EDITED_STRATEGY,
  UNSET_EDITED_STRATEGY,
  SET_MARKETS,
  SET_INDICATORS,
  INDICATORS_LOADED,
  MARKETS_LOADED
} from 'constants/ActionTypes';

import Strategy from 'models/Strategy';

const initialState = {
  strategy: new Strategy(),
  loaded: false,
  indicatorsLoaded: false,
  marketsLoaded: false,
  markets: [],
  indicators: []
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function strategyReducer(state = initialState, action) {
  switch (action.type) {
    case UNSET_EDITED_STRATEGY:
      return {
        ...state,
        strategy: new Strategy(),
        loaded: false,
        indicatorsLoaded: false,
        marketsLoaded: false,
        markets: [],
        indicators: []
      };
    case EDITED_STRATEGY_LOADED:
      return {
        ...state,
        loaded: action.loaded
      };
    case SET_EDITED_STRATEGY:
      return {
        ...state,
        strategy: action.strategy,
        loaded: false
      };
    case SET_MARKETS:
      return {
        ...state,
        markets: action.markets
      };
    case SET_INDICATORS:
      return {
        ...state,
        indicators: action.indicators
      };
    case INDICATORS_LOADED:
      return {
        ...state,
        indicatorsLoaded: action.loaded
      };
    case MARKETS_LOADED:
      return {
        ...state,
        marketsLoaded: action.loaded
      };

    default:
      return state;
  }
}
