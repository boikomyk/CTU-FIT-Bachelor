import {
  RECEIVE_WALLET,
  SET_WALLET,
  UPDATE_WALLET,
  UNSET_WALLET
} from 'constants/ActionTypes';
import Wallet from 'models/Wallet';

const initialState = {
  wallet: new Wallet(),
  loaded: false
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        wallet: action.wallet,
        loaded: false
      };

    case UNSET_WALLET:
      return {
        ...state,
        wallet: new Wallet(),
        loaded: false
      };

    case RECEIVE_WALLET:
      return {
        ...state,
        loaded: action.loaded
      };
    case UPDATE_WALLET:
      state.wallet.availableBalance = action.amount;
      return {
        ...state
      };

    default:
      return state;
  }
}
