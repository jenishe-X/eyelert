import type { AiFrameResult } from "../orchestrator/systemOrchestrator";
import { computeEAR, computeMAR, type Landmarks } from "./metrics";

export interface RawFrame {
  frameId: string;
  jpegBase64: string;
  ts: number;
}

export interface LandmarkEstimator {
  estimate(frame: RawFrame): Promise<Landmarks | null>;
}

class StubLandmarkEstimator implements LandmarkEstimator {
  async estimate(_frame: RawFrame): Promise<Landmarks | null> {
    return null;
  }
}

let estimator: LandmarkEstimator = new StubLandmarkEstimator();
let eyeClosedSinceMs: number | null = null;

export function setLandmarkEstimator(next: LandmarkEstimator): void {
  estimator = next;
}

export async function processFrame(frame: RawFrame): Promise<AiFrameResult | null> {
  if (!frame.jpegBase64) return null;

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

  const leftEar = computeEAR(landmarks.leftEye);
  const rightEar = computeEAR(landmarks.rightEye);
  const ear = (leftEar + rightEar) / 2;
  const mar = computeMAR(landmarks.mouth);
  const eyesClosed = ear < 0.2;

  if (eyesClosed) {
    if (eyeClosedSinceMs === null) eyeClosedSinceMs = frame.ts;
  } else {
    eyeClosedSinceMs = null;
  }
  const eyesClosedDurationSec =
    eyeClosedSinceMs === null ? 0 : Math.max(0, (frame.ts - eyeClosedSinceMs) / 1000);

  return {
    ear,
    mar,
    eyesClosed,
    eyesClosedDurationSec,
  };
}
