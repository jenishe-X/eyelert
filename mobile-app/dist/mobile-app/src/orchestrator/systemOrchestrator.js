"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemOrchestrator = void 0;
const metrics_1 = require("../ai/metrics");
const offlineNavigator_1 = require("../navigation/offlineNavigator");
const restAreas_1 = require("../navigation/restAreas");
class SystemOrchestrator {
    constructor(decision, ports) {
        this.decision = decision;
        this.ports = ports;
        this.perclos = new metrics_1.PerclosTracker(300);
        this.sessionId = `session-${Date.now()}`;
        this.state = "Alert";
        this.activeRouteTarget = null;
        this.arrivalRadiusM = 40;
    }
    onAiFrame(result) {
        const perclos = this.perclos.push(result.eyesClosed);
        const nextState = this.decision.classify({
            metrics: { ear: result.ear, mar: result.mar, perclos },
            eyesClosedDurationSec: result.eyesClosedDurationSec,
        });
        if (nextState !== "Alert" && this.state === "Alert") {
            this.emitAlert(nextState);
            this.emitPrompt("prompt_drowsy_rest_question");
        }
        this.state = nextState;
    }
    async onDeviceMessage(msg) {
        if (msg.type === "AUDIO_KEYWORD") {
            await this.handleKeyword(msg.keyword);
        }
    }
    onGpsTick(location) {
        if (!this.activeRouteTarget)
            return;
        const distance = (0, offlineNavigator_1.haversineMeters)(location, this.activeRouteTarget.location);
        if (distance <= this.arrivalRadiusM) {
            this.ports.sendToDevice({
                type: "ARRIVAL",
                ts: Date.now(),
                sessionId: this.sessionId,
                restAreaId: this.activeRouteTarget.id,
                arrived: true,
            });
            this.ports.sendToDevice({
                type: "REST_TIMER_CMD",
                ts: Date.now(),
                sessionId: this.sessionId,
                mode: "15M",
                start: true,
            });
            this.emitPrompt("arrived_start_rest");
            this.activeRouteTarget = null;
            this.state = "Alert";
        }
    }
    emitAlert(state) {
        const alert = {
            type: "ALERT_TRIGGER",
            ts: Date.now(),
            sessionId: this.sessionId,
            state,
            severity: state === "Fatigued" ? "HIGH" : "MEDIUM",
        };
        this.ports.sendToDevice(alert);
    }
    emitPrompt(clipId) {
        const prompt = {
            type: "VOICE_PROMPT",
            ts: Date.now(),
            sessionId: this.sessionId,
            clipId,
            priority: 10,
        };
        this.ports.sendToDevice(prompt);
    }
    async handleKeyword(keyword) {
        if (keyword === "NO") {
            this.emitPrompt("ack_continue_drive_carefully");
            return;
        }
        const origin = await this.ports.getCurrentGps();
        const nearest = (0, offlineNavigator_1.findNearestRestArea)(origin, restAreas_1.olongapoRestAreas);
        if (!nearest) {
            this.emitPrompt("no_rest_area_available");
            return;
        }
        const distanceM = (0, offlineNavigator_1.haversineMeters)(origin, nearest.location);
        const steps = (0, offlineNavigator_1.buildSimpleRouteSteps)(this.sessionId, nearest, distanceM);
        steps.forEach((step) => this.ports.sendToDevice(step));
        this.activeRouteTarget = nearest;
        this.emitPrompt("guidance_started_follow_voice");
    }
}
exports.SystemOrchestrator = SystemOrchestrator;
