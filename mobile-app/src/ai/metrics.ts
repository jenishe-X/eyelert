export interface Landmarks {
  leftEye: Array<{ x: number; y: number }>;
  rightEye: Array<{ x: number; y: number }>;
  mouth: Array<{ x: number; y: number }>;
}

export interface DrowsinessMetrics {
  ear: number;
  mar: number;
  perclos: number;
}

function euclidean(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function computeEAR(eye: Array<{ x: number; y: number }>): number {
  if (eye.length < 6) return 0;
  const vertical1 = euclidean(eye[1], eye[5]);
  const vertical2 = euclidean(eye[2], eye[4]);
  const horizontal = euclidean(eye[0], eye[3]);
  if (horizontal === 0) return 0;
  return (vertical1 + vertical2) / (2 * horizontal);
}

export function computeMAR(mouth: Array<{ x: number; y: number }>): number {
  if (mouth.length < 8) return 0;
  const vertical1 = euclidean(mouth[2], mouth[6]);
  const vertical2 = euclidean(mouth[3], mouth[5]);
  const horizontal = euclidean(mouth[0], mouth[4]);
  if (horizontal === 0) return 0;
  return (vertical1 + vertical2) / (2 * horizontal);
}

export class PerclosTracker {
  private readonly buffer: boolean[] = [];
  constructor(private readonly maxFrames = 300) {}

  push(isEyeClosed: boolean): number {
    this.buffer.push(isEyeClosed);
    if (this.buffer.length > this.maxFrames) this.buffer.shift();
    const closed = this.buffer.filter(Boolean).length;
    return this.buffer.length ? closed / this.buffer.length : 0;
  }
}
