"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrowsinessDecisionEngine = void 0;
class DrowsinessDecisionEngine {
    constructor(thresholds) {
        this.thresholds = thresholds;
    }
    classify(input) {
        const { ear, mar, perclos } = input.metrics;
        if (input.eyesClosedDurationSec >= this.thresholds.eyeClosedSeconds)
            return "Fatigued";
        const score = (ear < this.thresholds.earMin ? 0.5 : 0) +
            (mar > this.thresholds.marHigh ? 0.2 : 0) +
            (perclos > this.thresholds.perclosHigh ? 0.4 : 0);
        if (score >= 0.6)
            return "Fatigued";
        if (score >= 0.3)
            return "Drowsy";
        return "Alert";
    }
}
exports.DrowsinessDecisionEngine = DrowsinessDecisionEngine;
