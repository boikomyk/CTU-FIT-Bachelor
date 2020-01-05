import { Wampy } from 'wampy';
import {
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_CONNECT,
  WEBSOCKET_RECONNECT
} from 'constants/ActionTypes';
import { setSignal } from 'actions/signals/Signals';
import {
  pushNotification,
  removeGlobalNotification,
  setGlobalNotification
} from 'actions/notification/Notification';
import Signal from 'models/Signal';
import React from 'react';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import SyncOff from 'mdi-material-ui/SyncOff';
import Pulse from 'mdi-material-ui/Pulse';
import { websocketReconnect } from 'actions/websocket/Websocket';
import Button from 'components/button/Button';
let ws = null;
import Refresh from 'mdi-material-ui/Refresh';

export const websocket = store => next => action => {

  switch (action.type) {
    case WEBSOCKET_CONNECT:
      let jwt = store.getState().login.token;
      let w3cws = require('websocket').w3cwebsocket;
      ws = new Wampy(process.env.WS_API_ENTRY_POINT, {
        debug: false,
        ws: w3cws,
        autoReconnect: true,
        reconnectInterval: 1000,
        maxRetries: 1,
        realm: 'realm1',
        authmethods: ['jwt'],
        authid: 'user',
        onChallenge: () => {
          return jwt;
        },
        onError: function() {
          store.dispatch(
            setGlobalNotification(
              <span>
                {'You are '}
                <b>{'offline'}</b>
                {' right now. Check your connection and click '}
                <Button
                  size='xs'
                  margin={true}
                  color='white'
                  onClick={() => {
                    store.dispatch(websocketReconnect());
                  }}
                >
                  <Refresh fontSize='small' /> {' Refresh'}
                </Button>
              </span>,
              'danger',
              SyncOff
            )
          );
        },
        onConnect: function() {
          store.dispatch(removeGlobalNotification());
        },
        onReconnect: function() {},
        onReconnectSuccess: function() {}
      });

      ws.subscribe('websocket.subscription', {
        onEvent: function(result) {
          let signal = Signal.fromJSON(result.argsList[0]);
          store.dispatch(setSignal(signal));
          store.dispatch(
            pushNotification(
              <div>
                {'You have a new signal '}
                <b>{signal.action}</b>
                {' for strategy '}
                <Link
                  color='inherit'
                  to={{
                    pathname: '/dashboard/marketplace/' + signal.strategyId
                  }}
                  component={RouterLink}
                >
                  <b>{signal.strategyName}</b>
                </Link>{' '}
                {'.'}
              </div>,
              'rose',
              Pulse
            )
          );
        }
      });

      break;

    case WEBSOCKET_DISCONNECT:

      if (ws !== null) {
        ws.disconnect();
      }
      ws = null;
      break;
    case WEBSOCKET_RECONNECT:
      if (ws !== null) {
        ws.disconnect();
      }
      ws = null;
      break;
    default:
      break;
  }
  return next(action);
};
