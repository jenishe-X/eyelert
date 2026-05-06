import { createRnGpsProvider, type GeolocationLike } from "./platform/rnGpsProvider";
import { RnBackgroundTaskController, type BackgroundTaskApi } from "./platform/rnBackgroundTask";
import { BackgroundSessionService } from "./services/backgroundSession";

function isNodeRuntime(): boolean {
  return typeof process !== "undefined" && Boolean(process.versions?.node);
}

/** In-memory GPS for `npm start` / Node smoke runs (RN should inject a real adapter). */
function createNodeDevGeolocation(): GeolocationLike {
  const coords = { latitude: 37.7749, longitude: -122.4194 };
  const intervals = new Map<number, ReturnType<typeof setInterval>>();
  let nextId = 1;
  return {
    getCurrentPosition(success) {
      queueMicrotask(() => success({ coords: { ...coords } }));
    },
    watchPosition(success, _err, _opts) {
      const id = nextId++;
      intervals.set(
        id,
        setInterval(() => success({ coords: { ...coords } }), 2000)
      );
      return id;
    },
    clearWatch(watchId) {
      const t = intervals.get(watchId);
      if (t !== undefined) clearInterval(t);
      intervals.delete(watchId);
    },
  };
}

/** Minimal background API so session bootstrap runs under Node. */
function createNodeDevBackgroundApi(): BackgroundTaskApi {
  const running = new Set<string>();
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
let geolocation = (globalThis as unknown as { geolocation?: GeolocationLike }).geolocation;
let backgroundApi = (globalThis as unknown as { backgroundTaskApi?: BackgroundTaskApi })
  .backgroundTaskApi;

if (!geolocation || !backgroundApi) {
  if (!isNodeRuntime()) {
    throw new Error("Missing geolocation/background adapters. Bind them before starting session.");
  }
  console.warn(
    "[eyelert] No geolocation/backgroundTaskApi on globalThis; using Node dev stubs (set globals from native for real behavior)."
  );
  geolocation ??= createNodeDevGeolocation();
  backgroundApi ??= createNodeDevBackgroundApi();
}

const gpsProvider = createRnGpsProvider(geolocation);
const session = new BackgroundSessionService(gpsProvider);
const task = new RnBackgroundTaskController(backgroundApi, session);

void task.start();
