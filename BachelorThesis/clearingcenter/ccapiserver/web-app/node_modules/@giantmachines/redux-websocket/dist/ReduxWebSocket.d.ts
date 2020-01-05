import { Dispatch, MiddlewareAPI } from 'redux';
import { Action } from './types';
interface ReduxWebSocketOptions {
    prefix: string;
    reconnectInterval: number;
    onOpen?: (s: WebSocket) => void;
}
/**
 * ReduxWebSocket
 * @class
 *
 * Manages a WebSocket connection.
 */
export default class ReduxWebSocket {
    private options;
    private websocket;
    private reconnectCount;
    private reconnectionInterval;
    private lastSocketUrl;
    private hasOpened;
    /**
     * Constructor
     * @constructor
     *
     * @param {ReduxWebSocketOptions} options
     */
    constructor(options: ReduxWebSocketOptions);
    /**
     * WebSocket connect event handler.
     *
     * @param {MiddlewareAPI} store
     * @param {Action} action
     */
    connect: ({ dispatch }: MiddlewareAPI<Dispatch<import("redux").AnyAction>, any>, { payload }: Action) => void;
    /**
     * WebSocket disconnect event handler.
     *
     * @throws {Error} Socket connection must exist.
     */
    disconnect: () => void;
    /**
     * WebSocket send event handler.
     *
     * @param {MiddlewareAPI} _store
     * @param {Action} action
     *
     * @throws {Error} Socket connection must exist.
     */
    send: (_store: MiddlewareAPI<Dispatch<import("redux").AnyAction>, any>, { payload }: Action) => void;
    /**
     * Handle a close event.
     *
     * @param {Dispatch} dispatch
     * @param {string} prefix
     * @param {Event} event
     */
    private handleClose;
    /**
     * Handle an error event.
     *
     * @param {Dispatch} dispatch
     * @param {string} prefix
     * @param {Event} event
     */
    private handleError;
    /**
     * Handle an open event.
     *
     * @param {Dispatch} dispatch
     * @param {string} prefix
     * @param {(s: WebSocket) => void | undefined} onOpen
     * @param {Event} event
     */
    private handleOpen;
    /**
     * Handle a message event.
     *
     * @param {Dispatch} dispatch
     * @param {string} prefix
     * @param {MessageEvent} event
     */
    private handleMessage;
    /**
     * Close the WebSocket connection.
     * @private
     *
     * @param {number} [code]
     * @param {strin} [reason]
     */
    private close;
    /**
     * Handle a broken socket connection.
     * @private
     *
     * @param {Dispatch} dispatch
     */
    private handleBrokenConnection;
}
export {};
