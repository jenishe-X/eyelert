"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerclosTracker = void 0;
exports.computeEAR = computeEAR;
exports.computeMAR = computeMAR;
function euclidean(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
function computeEAR(eye) {
    if (eye.length < 6)
        return 0;
    const vertical1 = euclidean(eye[1], eye[5]);
    const vertical2 = euclidean(eye[2], eye[4]);
    const horizontal = euclidean(eye[0], eye[3]);
    if (horizontal === 0)
        return 0;
    return (vertical1 + vertical2) / (2 * horizontal);
}
function computeMAR(mouth) {
    if (mouth.length < 8)
        return 0;
    const vertical1 = euclidean(mouth[2], mouth[6]);
    const vertical2 = euclidean(mouth[3], mouth[5]);
    const horizontal = euclidean(mouth[0], mouth[4]);
    if (horizontal === 0)
        return 0;
    return (vertical1 + vertical2) / (2 * horizontal);
}
class PerclosTracker {
    constructor(maxFrames = 300) {
        this.maxFrames = maxFrames;
        this.buffer = [];
    }
    push(isEyeClosed) {
        this.buffer.push(isEyeClosed);
        if (this.buffer.length > this.maxFrames)
            this.buffer.shift();
        const closed = this.buffer.filter(Boolean).length;
        return this.buffer.length ? closed / this.buffer.length : 0;
    }
}
exports.PerclosTracker = PerclosTracker;
