import { strategyApi } from 'resources/rest/Strategy';
import history from 'helpers/history/History';
import {
  SET_EDITED_STRATEGY,
  EDITED_STRATEGY_LOADED,
  SET_MARKETS,
  SET_INDICATORS,
  MARKETS_LOADED,
  INDICATORS_LOADED,
  UNSET_EDITED_STRATEGY
} from 'constants/ActionTypes';
import Strategy from 'models/Strategy';
import { pushNotification } from 'actions/notification/Notification';
import { pushAlert } from 'actions/alert/Alert';
import Market from 'models/Market';
import Indicator from 'models/Indicator';
import store from 'reducers/Reducers';
import AlertCircle from 'mdi-material-ui/AlertCircle';
import React from 'react';

/**
 * @param {Object} strategy
 * @return {Object}
 */
export function setEditStrategy(strategy) {
  return {
    type: SET_EDITED_STRATEGY,
    strategy
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveEditStrategy(loaded) {
  return {
    type: EDITED_STRATEGY_LOADED,
    loaded
  };
}

/**
 * @param {Array} indicators
 * @return {Object}
 */
export function setIndicators(indicators) {
  return {
    type: SET_INDICATORS,
    indicators
  };
}

/**
 * @param {Array} markets
 * @return {Object}
 */
export function setMarkets(markets) {
  return {
    type: SET_MARKETS,
    markets
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveIndicators(loaded) {
  return {
    type: INDICATORS_LOADED,
    loaded
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveMarkets(loaded) {
  return {
    type: MARKETS_LOADED,
    loaded
  };
}

/**
 * @return {Promise}
 */
export const createStrategy = strategy => dispatch => {
  return strategyApi
    .createStrategy(
      strategy.market,
      strategy.indicators,
      strategy.fee,
      strategy.name,
      strategy.about
    )
    .then(response => {
      dispatch(
        pushAlert(
          'Strategy was successfully created!',
          'You can now connect your strategy with Clearing Center using API KEY: ' +
            response.data.API_KEY +
            '.',
          'success',
          () => {
            history.push('/dashboard/marketplace/' + response.data.id);
          }
        )
      );
    })
    .catch(response => {
      if (response && response.data && response.data.message) {
        dispatch(
          pushNotification(response.data.message, 'danger', AlertCircle)
        );
      }
    });
};
/**
 * @return {Promise}
 */
export const saveStrategy = strategy => dispatch => {
  return strategyApi
    .editStrategy(
      strategy.market,
      strategy.indicators,
      strategy.fee,
      strategy.name,
      strategy.about,
      strategy.id
    )
    .then(response => {
      dispatch(
        pushAlert('Strategy was successfully updated!', '', 'success', () => {
          history.push('/dashboard/marketplace/' + strategy.id);
        })
      );
    })
    .catch(response => {
      if (response && response.data && response.data.message) {
        dispatch(
          pushNotification(response.data.message, 'danger', AlertCircle)
        );
      }
    });
};
/**
 * @return {Promise}
 */
export const getEditedStrategy = id => (dispatch, getState) => {
  dispatch(unsetEditedStrategy);
  return strategyApi
    .getStrategy(id)
    .then(async response => {
      const _strategy = Strategy.fromJSON(response.data);
      _strategy.id = id;
      await dispatch(getIndicators());
      const indicators = getState().strategyEdit.indicators;

      let selectedIndicators = [];
      indicators.forEach(function(indicator) {
        _strategy.indicators.map((prop, key) => {
          if (prop.id === indicator.id) {
            selectedIndicators.push(indicator.id);
          }
        });
      });
      await dispatch(getMarkets());
      const markets = getState().strategyEdit.markets;
      let selectedMarket = '';
      markets.forEach(function(market) {
        if (_strategy.market === market.name) {
          selectedMarket = market.id;
        }
      });

      _strategy.indicators = selectedIndicators;
      _strategy.market = selectedMarket;

      dispatch(setEditStrategy(_strategy));
    })
    .finally(() => {
      dispatch(receiveEditStrategy(true));
    });
};

/**
 * @return {Promise}
 */
export const getMarkets = () => dispatch => {
  return strategyApi
    .getMarkets()
    .then(response => {
      const markets = [];
      response.data.markets.forEach(function(market) {
        markets.push(Market.fromJSON(market));
      });
      dispatch(receiveMarkets(false));
      dispatch(setMarkets(markets));
    })
    .finally(() => {
      dispatch(receiveMarkets(true));
    });
};

/**
 * @return {Object}
 */
export function unsetEditedStrategy() {
  return {
    type: UNSET_EDITED_STRATEGY
  };
}

/**
 * @return {Promise}
 */
export const getIndicators = () => dispatch => {
  return strategyApi
    .getIndicators()
    .then(response => {

      const indicators = [];
      response.data.indicators.forEach(function(indicator) {
        indicators.push(Indicator.fromJSON(indicator));
      });
      dispatch(receiveIndicators(false));
      dispatch(setIndicators(indicators));
    })
    .finally(() => {
      dispatch(receiveIndicators(true));
    });
};
