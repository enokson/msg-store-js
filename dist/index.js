"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var WebSocket = require("ws");
var events_1 = require("events");
var Route;
(function (Route) {
    Route["Set"] = "set";
    Route["Delete"] = "delete";
    Route["Next"] = "next";
    Route["ResetVolumes"] = "reset-volumes";
    Route["Metrics"] = "metrics";
})(Route || (Route = {}));
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(options) {
        var _this = _super.call(this) || this;
        _this.address = options.address;
        _this.ws = new WebSocket(_this.address);
        _this.doc = null;
        _this.ws.on('message', function (msg) { return _this.handleMessage(msg); });
        return _this;
    }
    Client.prototype.set = function (priority, msg) {
        this.ws.send(JSON.stringify({
            route: Route.Set,
            payload: {
                priority: priority,
                msg: msg
            }
        }));
    };
    Client.prototype.del = function (priority, id) {
        this.ws.send(JSON.stringify({
            route: Route.Delete,
            payload: {
                priority: priority,
                id: id
            }
        }));
    };
    Client.prototype.next = function () {
        this.ws.send(JSON.stringify({ route: Route.Next }));
    };
    Client.prototype.resetVolumes = function () {
        this.ws.send(JSON.stringify({ route: Route.ResetVolumes }));
    };
    Client.prototype.getMetrics = function () {
        this.ws.send(JSON.stringify({ route: Route.Metrics }));
    };
    Client.prototype.handleMessage = function (str) {
        var msg = JSON.parse(str);
        if (!msg.ok) {
            this.emit('error', msg);
            return;
        }
        if (msg.route == Route.Set) {
            this.emit(Route.Set, msg.data);
        }
        else if (msg.route == Route.Next) {
            this.emit(Route.Next, msg.data);
        }
        else if (msg.route == Route.Delete) {
            this.emit(Route.Delete, msg.data);
        }
        else if (msg.route == Route.Metrics) {
            this.emit(Route.Metrics, msg.data);
        }
        else if (msg.route == Route.ResetVolumes) {
            this.emit(Route.ResetVolumes, msg);
        }
    };
    return Client;
}(events_1.EventEmitter));
exports.Client = Client;
//# sourceMappingURL=index.js.map