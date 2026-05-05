"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLandmarkEstimator = setLandmarkEstimator;
exports.processFrame = processFrame;
const metrics_1 = require("./metrics");
class StubLandmarkEstimator {
    async estimate(_frame) {
        return null;
    }
}
let estimator = new StubLandmarkEstimator();
let eyeClosedSinceMs = null;
function setLandmarkEstimator(next) {
    estimator = next;
}
async function processFrame(frame) {
    if (!frame.jpegBase64)
        return null;
    const landmarks = await estimator.estimate(frame);
    if (!landmarks) {
        // Temporary fallback until model integration is complete.
        return {
            ear: 0.23,
            mar: 0.31,
            eyesClosed: false,
            eyesClosedDurationSec: 0,
        };
    }
    const leftEar = (0, metrics_1.computeEAR)(landmarks.leftEye);
    const rightEar = (0, metrics_1.computeEAR)(landmarks.rightEye);
    const ear = (leftEar + rightEar) / 2;
    const mar = (0, metrics_1.computeMAR)(landmarks.mouth);
    const eyesClosed = ear < 0.2;
    if (eyesClosed) {
        if (eyeClosedSinceMs === null)
            eyeClosedSinceMs = frame.ts;
    }
    else {
        eyeClosedSinceMs = null;
    }
    const eyesClosedDurationSec = eyeClosedSinceMs === null ? 0 : Math.max(0, (frame.ts - eyeClosedSinceMs) / 1000);
    return {
        ear,
        mar,
        eyesClosed,
        eyesClosedDurationSec,
    };
}
