import type { DriverState } from "../../../shared/protocol";
import type { DrowsinessMetrics } from "./metrics";

export interface Thresholds {
  earMin: number;
  marHigh: number;
  perclosHigh: number;
  eyeClosedSeconds: number;
}

export interface DecisionInput {
  metrics: DrowsinessMetrics;
  eyesClosedDurationSec: number;
}

export class DrowsinessDecisionEngine {
  constructor(private readonly thresholds: Thresholds) {}

  classify(input: DecisionInput): DriverState {
    const { ear, mar, perclos } = input.metrics;
    if (input.eyesClosedDurationSec >= this.thresholds.eyeClosedSeconds) return "Fatigued";

    const score =
      (ear < this.thresholds.earMin ? 0.5 : 0) +
      (mar > this.thresholds.marHigh ? 0.2 : 0) +
      (perclos > this.thresholds.perclosHigh ? 0.4 : 0);

    if (score >= 0.6) return "Fatigued";
    if (score >= 0.3) return "Drowsy";
    return "Alert";
  }
}
