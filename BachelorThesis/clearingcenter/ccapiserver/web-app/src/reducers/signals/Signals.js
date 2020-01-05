import {
  RECEIVE_SIGNALS,
  SET_SIGNALS,
  RESET_SIGNALS,
  SET_SIGNAL,
  RECEIVE_SIGNAL
} from 'constants/ActionTypes';

const initialState = {
  loaded: false,
  signals: [],
  newSignals: []
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function signalsReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_SIGNALS:
      return initialState;
    case SET_SIGNALS:
      return {
        ...state,
        signals: action.signals,
        loaded: false
      };
    case RECEIVE_SIGNALS:
      return {
        ...state,
        loaded: action.loaded
      };
    case SET_SIGNAL:
      return {
        ...state,
        newSignals: [...state.newSignals, action.signal]
      };

    default:
      return state;
  }
}
