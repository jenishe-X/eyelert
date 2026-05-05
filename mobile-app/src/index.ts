import { createRnGpsProvider, type GeolocationLike } from "./platform/rnGpsProvider";
import { RnBackgroundTaskController, type BackgroundTaskApi } from "./platform/rnBackgroundTask";
import { BackgroundSessionService } from "./services/backgroundSession";

/**
 * Runtime wiring:
 * - bind `geolocation` to your RN geolocation module
 * - bind `backgroundApi` to your preferred background-task library
 */
const geolocation = (globalThis as unknown as { geolocation?: GeolocationLike }).geolocation;
const backgroundApi = (globalThis as unknown as { backgroundTaskApi?: BackgroundTaskApi })
  .backgroundTaskApi;

if (!geolocation || !backgroundApi) {
  throw new Error("Missing geolocation/background adapters. Bind them before starting session.");
}

const gpsProvider = createRnGpsProvider(geolocation);
const session = new BackgroundSessionService(gpsProvider);
const task = new RnBackgroundTaskController(backgroundApi, session);

void task.start();
