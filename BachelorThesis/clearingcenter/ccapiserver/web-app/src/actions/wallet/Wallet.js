import { wallet } from 'resources/rest/Wallet';

import {
  RECEIVE_WALLET,
  SET_WALLET,
  UPDATE_WALLET,
  UNSET_WALLET
} from 'constants/ActionTypes';
import Wallet from 'models/Wallet';
import { pushNotification } from 'actions/notification/Notification';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import React from 'react';
/**
 * @param {Object} wallet
 * @return {Object}
 */
export function setWallet(wallet) {
  return {
    type: SET_WALLET,
    wallet
  };
}

/**
 * @param {Object} amount
 * @return {Object}
 */
export function updateWallet(amount) {
  return {
    type: UPDATE_WALLET,
    amount
  };
}

/**
 * @return {Object}
 */
export function unsetWallet() {
  return {
    type: UNSET_WALLET
  };
}

/**
 * @param {boolean} loaded
 * @return {Object}
 */
export function receiveWallet(loaded) {
  return {
    type: RECEIVE_WALLET,
    loaded
  };
}

/**
 * @return {Promise}
 */
export const getWallet = () => dispatch => {
  return wallet
    .getWallet()
    .then(response => {
      dispatch(setWallet(Wallet.fromJSON(response.data)));
      dispatch(receiveWallet(true));
    })
    .catch(() => {
      dispatch(setWallet(new Wallet()));
      dispatch(receiveWallet(false));
    });
};

/**
 * @return {Promise}
 */
export const updateAmount = amount => dispatch => {
  dispatch(receiveWallet(false));
  return wallet
    .updateAmount(amount)
    .then(response => {
      dispatch(updateWallet(parseFloat(response.data.balance)));
      dispatch(receiveWallet(true));
      dispatch(
        pushNotification(
          response.data.balance +
            ' FaKe Coins have been successfully added to your Wallet.',
          'success',
          CurrencyUsd
        )
      );
    })
    .catch(() => {
      dispatch(receiveWallet(false));
    });
};
