import type { DeviceToMobileMessage, MobileToDeviceMessage } from "../../../shared/protocol";

export interface DeviceSocketOptions {
  url: string;
  onMessage(msg: DeviceToMobileMessage): void;
  onStatus?(status: "connecting" | "open" | "closed"): void;
}

type CompatibleWebSocket = {
  onopen: (() => void) | null;
  onclose: (() => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  send(data: string): void;
  close(): void;
};

type WebSocketCtor = new (url: string) => CompatibleWebSocket;

function resolveWebSocketCtor(): WebSocketCtor {
  const maybeCtor = (globalThis as unknown as { WebSocket?: WebSocketCtor }).WebSocket;
  if (!maybeCtor) {
    throw new Error("WebSocket global not available. Bind RN or polyfill implementation.");
  }
  return maybeCtor;
}

export class DeviceSocketClient {
  private ws: CompatibleWebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly options: DeviceSocketOptions) {}

  connect(): void {
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
        const parsed = JSON.parse(event.data) as DeviceToMobileMessage;
        this.options.onMessage(parsed);
      } catch {
        // Ignore malformed packets to keep session alive.
      }
    };
  }

  send(message: MobileToDeviceMessage): void {
    if (!this.ws) return;
    this.ws.send(JSON.stringify(message));
  }

  close(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    if (this.ws) this.ws.close();
    this.ws = null;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 1500);
  }
}
