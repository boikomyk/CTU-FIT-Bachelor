declare type BuiltAction<T> = {
    type: string;
    meta: {
        timestamp: Date;
    };
    payload?: T;
};
export declare const connect: (url: string, prefix?: string | undefined) => BuiltAction<{
    url: string;
}>;
export declare const disconnect: (prefix?: string | undefined) => BuiltAction<{}>;
export declare const send: (msg: any, prefix?: string | undefined) => BuiltAction<any>;
export declare const beginReconnect: (prefix: string) => BuiltAction<{}>;
export declare const reconnectAttempt: (count: number, prefix: string) => BuiltAction<{
    count: number;
}>;
export declare const reconnected: (prefix: string) => BuiltAction<{}>;
export declare const open: (event: Event, prefix: string) => BuiltAction<Event>;
export declare const broken: (prefix: string) => BuiltAction<{}>;
export declare const closed: (event: Event, prefix: string) => BuiltAction<Event>;
export declare const message: (event: MessageEvent, prefix: string) => BuiltAction<{
    event: MessageEvent;
    message: any;
    origin: string;
}>;
export declare const error: (originalAction: {
    type: "CLOSED";
    payload: any;
} | {
    type: "CONNECT";
    payload: any;
} | {
    type: "DISCONNECT";
    payload: any;
} | {
    type: "MESSAGE";
    payload: any;
} | {
    type: "OPEN";
    payload: any;
} | {
    type: "SEND";
    payload: any;
} | null, err: Error, prefix: string) => BuiltAction<Error>;
export {};
