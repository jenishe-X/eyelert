"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundSessionService = void 0;
const decisionEngine_1 = require("../ai/decisionEngine");
const pipeline_1 = require("../ai/pipeline");
const systemOrchestrator_1 = require("../orchestrator/systemOrchestrator");
const deviceSocketClient_1 = require("../transport/deviceSocketClient");
class BackgroundSessionService {
    constructor(gps, wsUrl = "ws://192.168.4.1:8080/ws") {
        this.gps = gps;
        this.stopGpsWatch = null;
        const socket = new deviceSocketClient_1.DeviceSocketClient({
            url: wsUrl,
            onMessage: (msg) => void this.handleDeviceMessage(msg),
            onStatus: () => {
                // Hook for telemetry/notification integration.
            },
        });
        this.socket = socket;
        this.orchestrator = new systemOrchestrator_1.SystemOrchestrator(new decisionEngine_1.DrowsinessDecisionEngine({
            earMin: 0.2,
            marHigh: 0.65,
            perclosHigh: 0.4,
            eyeClosedSeconds: 2,
        }), {
            sendToDevice: (msg) => socket.send(msg),
            getCurrentGps: () => this.gps.getCurrentLocation(),
        });
    }
    start() {
        this.socket.connect();
        this.stopGpsWatch = this.gps.watch((location) => this.orchestrator.onGpsTick(location));
    }
    stop() {
        this.socket.close();
        if (this.stopGpsWatch)
            this.stopGpsWatch();
        this.stopGpsWatch = null;
    }
    async handleDeviceMessage(msg) {
        if (msg.type === "VIDEO_FRAME") {
            const result = await (0, pipeline_1.processFrame)({
                frameId: msg.frameId,
                jpegBase64: msg.jpegBase64,
                ts: msg.ts,
            });
            if (result)
                this.orchestrator.onAiFrame(result);
            return;
        }
        await this.orchestrator.onDeviceMessage(msg);
    }
}
exports.BackgroundSessionService = BackgroundSessionService;
