import { strategyApi } from 'resources/rest/Strategy';

import {
  RECEIVE_SIGNALS,
  SET_SIGNALS,
  RESET_SIGNALS,
  SET_SIGNAL
} from 'constants/ActionTypes';

import Strategy from 'models/Strategy';

/**
 * @param {Array} signals
 * @return {Object}
 */
export function setSignals(signals) {
  return {
    type: SET_SIGNALS,
    signals
  };
}
/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveSignals(loaded) {
  return {
    type: RECEIVE_SIGNALS,
    loaded
  };
}

/**
 * @param {Object} signal
 * @return {Object}
 */
export function setSignal(signal) {
  return {
    type: SET_SIGNAL,
    signal
  };
}

/**
 * @return {Object}
 */
export function resetSignals() {
  return {
    type: RESET_SIGNALS
  };
}

/**
 * @return {Promise}
 */
export const getSignals = () => dispatch => {
  dispatch(resetSignals());
  return strategyApi
    .getAllSignals()
    .then(response => {
      const signals = [];
      response.data.signals.forEach(function(signal) {
        signals.push(Strategy.fromJSON(signal));
      });

      dispatch(setSignals(signals));
      dispatch(receiveSignals(true));
    })
    .catch(() => {
      dispatch(receiveSignals(false));
    });
};
