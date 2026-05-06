"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rnGpsProvider_1 = require("./platform/rnGpsProvider");
const rnBackgroundTask_1 = require("./platform/rnBackgroundTask");
const backgroundSession_1 = require("./services/backgroundSession");
function isNodeRuntime() {
    return typeof process !== "undefined" && Boolean(process.versions?.node);
}
/** In-memory GPS for `npm start` / Node smoke runs (RN should inject a real adapter). */
function createNodeDevGeolocation() {
    const coords = { latitude: 37.7749, longitude: -122.4194 };
    const intervals = new Map();
    let nextId = 1;
    return {
        getCurrentPosition(success) {
            queueMicrotask(() => success({ coords: { ...coords } }));
        },
        watchPosition(success, _err, _opts) {
            const id = nextId++;
            intervals.set(id, setInterval(() => success({ coords: { ...coords } }), 2000));
            return id;
        },
        clearWatch(watchId) {
            const t = intervals.get(watchId);
            if (t !== undefined)
                clearInterval(t);
            intervals.delete(watchId);
        },
    };
}
/** Minimal background API so session bootstrap runs under Node. */
function createNodeDevBackgroundApi() {
    const running = new Set();
    return {
        async start(name, task) {
            running.add(name);
            await task();
        },
        async stop(name) {
            running.delete(name);
        },
        isRunning(name) {
            return running.has(name);
        },
    };
}
/**
 * Runtime wiring:
 * - bind `geolocation` to your RN geolocation module
 * - bind `backgroundTaskApi` to your preferred background-task library
 * Under Node (e.g. `npm start`), stub adapters are used if globals are unset.
 */
let geolocation = globalThis.geolocation;
let backgroundApi = globalThis
    .backgroundTaskApi;
if (!geolocation || !backgroundApi) {
    if (!isNodeRuntime()) {
        throw new Error("Missing geolocation/background adapters. Bind them before starting session.");
    }
    console.warn("[eyelert] No geolocation/backgroundTaskApi on globalThis; using Node dev stubs (set globals from native for real behavior).");
    geolocation ?? (geolocation = createNodeDevGeolocation());
    backgroundApi ?? (backgroundApi = createNodeDevBackgroundApi());
}
const gpsProvider = (0, rnGpsProvider_1.createRnGpsProvider)(geolocation);
const session = new backgroundSession_1.BackgroundSessionService(gpsProvider);
const task = new rnBackgroundTask_1.RnBackgroundTaskController(backgroundApi, session);
void task.start();
