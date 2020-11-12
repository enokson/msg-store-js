import WebSocket = require('ws')
import { EventEmitter } from 'events'

enum Route {
    Set = "set",
    Delete = 'delete',
    Next = 'next',
    ResetVolumes = 'reset-volumes',
    Metrics = 'metrics'
}

interface Doc {
    priority: number,
    id: number
}

interface ClientOptions {
    address: string
}

export class Client extends EventEmitter{
    address: string
    ws: WebSocket
    doc: Doc | null
    constructor(options: ClientOptions) {
        super()
        this.address = options.address
        this.ws = new WebSocket(this.address)
        this.doc = null;
        this.ws.on('message', (msg: string) => this.handleMessage(msg))
    }
    set(priority: number, msg: any) {
        this.ws.send(JSON.stringify({
            route: Route.Set,
            payload: {
                priority,
                msg
            }
        }))
    }
    del(priority: number, id: number) {
        this.ws.send(JSON.stringify({
            route: Route.Delete,
            payload: {
                priority,
                id
            }
        }))
    }
    next() {
        this.ws.send(JSON.stringify({ route: Route.Next }))
    }
    resetVolumes() {
        this.ws.send(JSON.stringify({ route: Route.ResetVolumes }))
    }
    getMetrics() {
        this.ws.send(JSON.stringify({ route: Route.Metrics }))
    }
    handleMessage(str: string) {
        let msg: any = JSON.parse(str);
        if (!msg.ok) {
            this.emit('error', msg)
            return
        }
        if (msg.route == Route.Set) {
            this.emit(Route.Set, msg.data)
        } else if (msg.route == Route.Next) {
           this.emit(Route.Next, msg.data)
        } else if (msg.route == Route.Delete) {
            this.emit(Route.Delete, msg.data)
        } else if (msg.route == Route.Metrics) {
            this.emit(Route.Metrics, msg.data)
        } else if (msg.route == Route.ResetVolumes) {
            this.emit(Route.ResetVolumes, msg)
        }
    }
}
