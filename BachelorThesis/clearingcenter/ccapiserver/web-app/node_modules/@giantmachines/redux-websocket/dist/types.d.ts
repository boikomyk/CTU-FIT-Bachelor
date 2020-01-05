import { WEBSOCKET_CLOSED, WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT, WEBSOCKET_MESSAGE, WEBSOCKET_OPEN, WEBSOCKET_SEND } from './actionTypes';
declare type ActionType = typeof WEBSOCKET_CLOSED | typeof WEBSOCKET_CONNECT | typeof WEBSOCKET_DISCONNECT | typeof WEBSOCKET_MESSAGE | typeof WEBSOCKET_OPEN | typeof WEBSOCKET_SEND;
declare type Action = {
    type: typeof WEBSOCKET_CLOSED;
    payload: any;
} | {
    type: typeof WEBSOCKET_CONNECT;
    payload: any;
} | {
    type: typeof WEBSOCKET_DISCONNECT;
    payload: any;
} | {
    type: typeof WEBSOCKET_MESSAGE;
    payload: any;
} | {
    type: typeof WEBSOCKET_OPEN;
    payload: any;
} | {
    type: typeof WEBSOCKET_SEND;
    payload: any;
};
declare type Options = {
    prefix?: string;
    reconnectInterval?: number;
    onOpen?: (s: WebSocket) => void;
};
export { Action, ActionType, Options, };
