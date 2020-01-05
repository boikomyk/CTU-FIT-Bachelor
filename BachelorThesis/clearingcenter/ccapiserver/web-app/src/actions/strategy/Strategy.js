import { strategyApi } from 'resources/rest/Strategy';
import {
  RECEIVE_STRATEGY,
  SET_STRATEGY,
  UNSET_STRATEGY,
  RECEIVE_STRATEGY_SIGNALS,
  SET_STRATEGY_SIGNALS,
  SET_CANDLES,
  RECEIVE_CANDLES,
  FOLLOW_STRATEGY,
  SUBSCRIBE_STRATEGY,
  RESET_STRATEGY,
  RESET_CANDLES
} from 'constants/ActionTypes';
import Strategy from 'models/Strategy';
import Candle from 'models/Candle';
import Signal from 'models/Signal';
import { pushNotification } from 'actions/notification/Notification';

import Heart from 'mdi-material-ui/Heart';
import HeartOff from 'mdi-material-ui/HeartOff';
import React from 'react';
import CheckCircle from 'mdi-material-ui/CheckCircle';
import CloseCircle from 'mdi-material-ui/CloseCircle';

/**
 * @param {Array} candles
 * @return {Object}
 */
export function setCandles(candles) {
  return {
    type: SET_CANDLES,
    candles
  };
}

/**
 * @param {boolean} follow
 * @return {Object}
 */
export function followStrategy(follow) {
  return {
    type: FOLLOW_STRATEGY,
    follow
  };
}

/**
 * @param {boolean} subscribe
 * @return {Object}
 */
export function subscribeStrategy(subscribe) {
  return {
    type: SUBSCRIBE_STRATEGY,
    subscribe
  };
}

/**
 * @return {Object}
 */
export function unsetStrategy() {
  return {
    type: UNSET_STRATEGY
  };
}

/**
 * @param {Object} strategy
 * @return {Object}
 */
export function setStrategy(strategy) {
  return {
    type: SET_STRATEGY,
    strategy
  };
}

/**
 * @param {Array} signals
 * @return {Object}
 */
export function setSignals(signals) {
  return {
    type: SET_STRATEGY_SIGNALS,
    signals
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveCandles(loaded) {
  return {
    type: RECEIVE_CANDLES,
    loaded
  };
}
/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveSignals(loaded) {
  return {
    type: RECEIVE_STRATEGY_SIGNALS,
    loaded
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveStrategy(loaded) {
  return {
    type: RECEIVE_STRATEGY,
    loaded
  };
}

/**
 * @return {Promise}
 */
export const follow = (id, follow) => dispatch => {
  return strategyApi
    .followStrategy(id, follow)
    .then(response => {
      dispatch(followStrategy(follow));
      if (follow) {
        dispatch(
          pushNotification(
            'Strategy has been successfully added to your favorites.',
            'success',
            Heart
          )
        );
      } else {
        dispatch(
          pushNotification(
            'Strategy has been successfully removed from  your favorites.',
            'warning',
            HeartOff
          )
        );
      }
    })
    .catch(() => {});
};

/**
 * @return {Promise}
 */
export const subscribe = (id, subscribe) => dispatch => {
  return strategyApi
    .subscribeStrategy(id, subscribe)
    .then(response => {
      dispatch(subscribeStrategy(subscribe));
      if (subscribe === true) {
        dispatch(followStrategy(true));
      }
      if (subscribe) {
        dispatch(
          pushNotification(
            'Strategy has been successfully subscribed.',
            'success',
            CheckCircle
          )
        );
      } else {
        dispatch(
          pushNotification(
            'Strategy has been successfully unsubscribed.',
            'warning',
            CloseCircle
          )
        );
      }
    })
    .catch(() => {});
};

/**
 * @return {Promise}
 */
export const getStrategy = id => dispatch => {
  dispatch(unsetStrategy());
  return strategyApi
    .getStrategy(id)
    .then(response => {
      const _strategy = Strategy.fromJSON(response.data);
      _strategy.id = id;
      dispatch(receiveStrategy(false));
      dispatch(setStrategy(_strategy));
    })
    .finally(() => {
      dispatch(receiveStrategy(true));
    });
};

/**
 * @return {Promise}
 */
export const getCandles = id => dispatch => {
  return strategyApi
    .getCandles(id)
    .then(response => {
      const candles = [];
      response.data.candles.forEach(function(candle) {
        candles.push(Candle.fromJSON(candle));
      });

      dispatch(setCandles(candles));
      dispatch(receiveCandles(true));
    })
    .catch(() => {
      dispatch(receiveCandles(false));
    });
};

/**
 * @return {Promise}
 */
export const getSignals = id => dispatch => {
  return strategyApi
    .getStrategySignals(id)
    .then(response => {
      const signals = [];
      response.data.signals.forEach(function(signal) {
        signals.push(Signal.fromJSON(signal));
      });

      dispatch(setSignals(signals));
      dispatch(receiveSignals(true));
    })
    .catch(() => {
      dispatch(receiveSignals(false));
    });
};
