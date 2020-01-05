import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_RECONNECT
} from 'constants/ActionTypes';

/**
 * @return {Object}
 */
export function websocketConnect() {
  return {
    type: WEBSOCKET_CONNECT
  };
}
/**
 * @return {Object}
 */
export function websocketReconnect() {
  return {
    type: WEBSOCKET_RECONNECT
  };
}

/**
 * @return {Object}
 */
export function websocketDisconnect() {
  return {
    type: WEBSOCKET_DISCONNECT
  };
}
