import React from 'react';

import { strategyApi } from 'resources/rest/Strategy';

import {
  RECEIVE_FOLLOWING_STRATEGIES,
  SET_FOLLOWING_STRATEGIES,
  RESET_FOLLOWING_STRATEGIES,
  UPDATE_FOLLOWING_STRATEGIES
} from 'constants/ActionTypes';

import Strategy from 'models/Strategy';
import { pushNotification } from 'actions/notification/Notification';
import CloseCircle from 'mdi-material-ui/CloseCircle';
import CheckCircle from 'mdi-material-ui/CheckCircle';

/**
 * @param {Array} strategies
 * @return {Object}
 */
export function setFollowingStrategies(strategies) {
  return {
    type: SET_FOLLOWING_STRATEGIES,
    strategies
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function loadFollowingStrategies(loaded) {
  return {
    type: RECEIVE_FOLLOWING_STRATEGIES,
    loaded
  };
}

/**
 * @param {Array} strategies
 * @return {Object}
 */
export function updateFollowingStrategies(strategies) {
  return {
    type: UPDATE_FOLLOWING_STRATEGIES,
    strategies
  };
}

/**
 * @return {Object}
 */
export function resetFollowingStrategies() {
  return {
    type: RESET_FOLLOWING_STRATEGIES
  };
}

/**
 * @return {Promise}
 */
export const getFollowingStrategies = () => dispatch => {
  dispatch(resetFollowingStrategies());
  return strategyApi
    .getAllFollowingStrategies()
    .then(response => {
      const strategies = [];
      response.data.strategies.forEach(function(strategy) {
        strategies.push(Strategy.fromJSON(strategy));
      });

      dispatch(setFollowingStrategies(strategies));
      dispatch(loadFollowingStrategies(true));
    })
    .catch(() => {
      dispatch(loadFollowingStrategies(false));
    });
};

/**
 * @return {Promise}
 */
export const subscribe = (id, subscribe) => (dispatch, getState) => {
  return strategyApi
    .subscribeStrategy(id, subscribe)
    .then(response => {
      const strategies = getState().followingStrategies.strategies;
      let _strategies = [];
      strategies.forEach(function(strategy) {
        if (strategy.id === id) {
          strategy.subscribe = subscribe;
        }
        _strategies.push(strategy);
      });
      dispatch(updateFollowingStrategies(_strategies));
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
