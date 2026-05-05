import type {
  AlertTriggerMessage,
  DeviceToMobileMessage,
  DriverState,
  KeywordCommand,
  MobileToDeviceMessage,
  VoicePromptMessage,
} from "../../../shared/protocol";
import { DrowsinessDecisionEngine } from "../ai/decisionEngine";
import { PerclosTracker } from "../ai/metrics";
import { buildSimpleRouteSteps, findNearestRestArea, haversineMeters } from "../navigation/offlineNavigator";
import { olongapoRestAreas, type Coordinate, type RestArea } from "../navigation/restAreas";

export interface AiFrameResult {
  ear: number;
  mar: number;
  eyesClosed: boolean;
  eyesClosedDurationSec: number;
}

export interface OrchestratorPorts {
  sendToDevice(message: MobileToDeviceMessage): void;
  getCurrentGps(): Promise<Coordinate>;
}

export class SystemOrchestrator {
  private readonly perclos = new PerclosTracker(300);
  private readonly sessionId = `session-${Date.now()}`;
  private state: DriverState = "Alert";
  private activeRouteTarget: RestArea | null = null;
  private arrivalRadiusM = 40;

  constructor(
    private readonly decision: DrowsinessDecisionEngine,
    private readonly ports: OrchestratorPorts
  ) {}

  onAiFrame(result: AiFrameResult): void {
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

  async onDeviceMessage(msg: DeviceToMobileMessage): Promise<void> {
    if (msg.type === "AUDIO_KEYWORD") {
      await this.handleKeyword(msg.keyword);
    }
  }

  onGpsTick(location: Coordinate): void {
    if (!this.activeRouteTarget) return;
    const distance = haversineMeters(location, this.activeRouteTarget.location);
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

  private emitAlert(state: DriverState): void {
    const alert: AlertTriggerMessage = {
      type: "ALERT_TRIGGER",
      ts: Date.now(),
      sessionId: this.sessionId,
      state,
      severity: state === "Fatigued" ? "HIGH" : "MEDIUM",
    };
    this.ports.sendToDevice(alert);
  }

  private emitPrompt(clipId: string): void {
    const prompt: VoicePromptMessage = {
      type: "VOICE_PROMPT",
      ts: Date.now(),
      sessionId: this.sessionId,
      clipId,
      priority: 10,
    };
    this.ports.sendToDevice(prompt);
  }

  private async handleKeyword(keyword: KeywordCommand): Promise<void> {
    if (keyword === "NO") {
      this.emitPrompt("ack_continue_drive_carefully");
      return;
    }

    const origin = await this.ports.getCurrentGps();
    const nearest = findNearestRestArea(origin, olongapoRestAreas);
    if (!nearest) {
      this.emitPrompt("no_rest_area_available");
      return;
    }

    const distanceM = haversineMeters(origin, nearest.location);
    const steps = buildSimpleRouteSteps(this.sessionId, nearest, distanceM);
    steps.forEach((step) => this.ports.sendToDevice(step));
    this.activeRouteTarget = nearest;
    this.emitPrompt("guidance_started_follow_voice");
  }
}
