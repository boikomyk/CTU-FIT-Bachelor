import { strategyApi } from 'resources/rest/Strategy';

import {
  RECEIVE_STRATEGIES,
  SET_STRATEGIES,
  RESET_STRATEGIES
} from 'constants/ActionTypes';

import Strategy from 'models/Strategy';

/**
 * @param {Array} strategies
 * @return {Object}
 */
export function setStrategies(strategies) {
  return {
    type: SET_STRATEGIES,
    strategies
  };
}
/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveStrategies(loaded) {
  return {
    type: RECEIVE_STRATEGIES,
    loaded
  };
}

/**
 * @return {Object}
 */
export function resetStrategies() {
  return {
    type: RESET_STRATEGIES
  };
}

/**
 * @return {Promise}
 */
export const getStrategies = () => dispatch => {
  dispatch(resetStrategies());
  return strategyApi
    .getStrategies()
    .then(response => {
      const strategies = [];
      response.data.strategies.forEach(function(strategy) {
        strategies.push(Strategy.fromJSON(strategy));
      });

      dispatch(setStrategies(strategies));
      dispatch(receiveStrategies(true));
    })
    .catch(() => {
      dispatch(receiveStrategies(false));
    });
};
