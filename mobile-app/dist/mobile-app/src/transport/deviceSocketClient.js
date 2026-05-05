"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSocketClient = void 0;
function resolveWebSocketCtor() {
    const maybeCtor = globalThis.WebSocket;
    if (!maybeCtor) {
        throw new Error("WebSocket global not available. Bind RN or polyfill implementation.");
    }
    return maybeCtor;
}
class DeviceSocketClient {
    constructor(options) {
        this.options = options;
        this.ws = null;
        this.reconnectTimer = null;
    }
    connect() {
        this.options.onStatus?.("connecting");
        const WebSocketImpl = resolveWebSocketCtor();
        this.ws = new WebSocketImpl(this.options.url);
        this.ws.onopen = () => this.options.onStatus?.("open");
        this.ws.onclose = () => {
            this.options.onStatus?.("closed");
            this.scheduleReconnect();
        };
        this.ws.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                this.options.onMessage(parsed);
            }
            catch {
                // Ignore malformed packets to keep session alive.
            }
        };
    }
    send(message) {
        if (!this.ws)
            return;
        this.ws.send(JSON.stringify(message));
    }
    close() {
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
        if (this.ws)
            this.ws.close();
        this.ws = null;
    }
    scheduleReconnect() {
        if (this.reconnectTimer)
            return;
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, 1500);
    }
}
exports.DeviceSocketClient = DeviceSocketClient;
