import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_RECONNECT
} from 'constants/ActionTypes';

const initialState = {
  connected: false,
  disconnected: false
};

/**
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export default function websocketReducer(state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      return {
        ...state,
        connected: true,
        disconnected: false
      };

    case WEBSOCKET_DISCONNECT:
      return {
        ...state,
        connected: false,
        disconnected: true
      };
    case WEBSOCKET_RECONNECT:
      return {
        ...state,
        connected: false,
        disconnected: false
      };

    default:
      return state;
  }
}
