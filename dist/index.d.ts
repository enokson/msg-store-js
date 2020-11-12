/// <reference types="node" />
import WebSocket = require('ws');
import { EventEmitter } from 'events';
interface Doc {
    priority: number;
    id: number;
}
interface ClientOptions {
    address: string;
}
export declare class Client extends EventEmitter {
    address: string;
    ws: WebSocket;
    doc: Doc | null;
    constructor(options: ClientOptions);
    set(priority: number, msg: any): void;
    del(priority: number, id: number): void;
    next(): void;
    resetVolumes(): void;
    getMetrics(): void;
    handleMessage(str: string): void;
}
export {};
//# sourceMappingURL=index.d.ts.map