import type { DeviceToMobileMessage } from "../../../shared/protocol";
import { DrowsinessDecisionEngine } from "../ai/decisionEngine";
import { processFrame } from "../ai/pipeline";
import { SystemOrchestrator } from "../orchestrator/systemOrchestrator";
import type { Coordinate } from "../navigation/restAreas";
import { DeviceSocketClient } from "../transport/deviceSocketClient";

export interface GpsProvider {
  getCurrentLocation(): Promise<Coordinate>;
  watch(onTick: (location: Coordinate) => void): () => void;
}

export class BackgroundSessionService {
  private readonly socket: DeviceSocketClient;
  private readonly orchestrator: SystemOrchestrator;
  private stopGpsWatch: (() => void) | null = null;

  constructor(private readonly gps: GpsProvider, wsUrl = "ws://192.168.4.1:8080/ws") {
    const socket = new DeviceSocketClient({
      url: wsUrl,
      onMessage: (msg) => void this.handleDeviceMessage(msg),
      onStatus: () => {
        // Hook for telemetry/notification integration.
      },
    });
    this.socket = socket;

    this.orchestrator = new SystemOrchestrator(
      new DrowsinessDecisionEngine({
        earMin: 0.2,
        marHigh: 0.65,
        perclosHigh: 0.4,
        eyeClosedSeconds: 2,
      }),
      {
        sendToDevice: (msg) => socket.send(msg),
        getCurrentGps: () => this.gps.getCurrentLocation(),
      }
    );
  }

  start(): void {
    this.socket.connect();
    this.stopGpsWatch = this.gps.watch((location) => this.orchestrator.onGpsTick(location));
  }

  stop(): void {
    this.socket.close();
    if (this.stopGpsWatch) this.stopGpsWatch();
    this.stopGpsWatch = null;
  }

  private async handleDeviceMessage(msg: DeviceToMobileMessage): Promise<void> {
    if (msg.type === "VIDEO_FRAME") {
      const result = await processFrame({
        frameId: msg.frameId,
        jpegBase64: msg.jpegBase64,
        ts: msg.ts,
      });
      if (result) this.orchestrator.onAiFrame(result);
      return;
    }
    await this.orchestrator.onDeviceMessage(msg);
  }
}
