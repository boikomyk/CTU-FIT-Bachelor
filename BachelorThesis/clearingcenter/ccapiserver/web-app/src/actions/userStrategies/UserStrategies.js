import { strategyApi } from 'resources/rest/Strategy';

import {
  RECEIVE_USER_STRATEGIES,
  SET_USER_STRATEGIES,
  RESET_USER_STRATEGIES
} from 'constants/ActionTypes';

import Strategy from 'models/Strategy';

/**
 * @param {Array} strategies
 * @return {Object}
 */
export function setUserStrategies(strategies) {
  return {
    type: SET_USER_STRATEGIES,
    strategies
  };
}
/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveUserStrategies(loaded) {
  return {
    type: RECEIVE_USER_STRATEGIES,
    loaded
  };
}

/**
 * @return {Object}
 */
export function resetUserStrategies() {
  return {
    type: RESET_USER_STRATEGIES
  };
}

/**
 * @return {Promise}
 */
export const getUserStrategies = () => dispatch => {
  dispatch(resetUserStrategies());
  return strategyApi
    .getUserStrategies()
    .then(response => {
      const strategies = [];
      response.data.strategies.forEach(function(strategy) {
        strategies.push(Strategy.fromJSON(strategy));
      });

      dispatch(setUserStrategies(strategies));
      dispatch(receiveUserStrategies(true));
    })
    .catch(() => {
      dispatch(receiveUserStrategies(false));
    });
};
