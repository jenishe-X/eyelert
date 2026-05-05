"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rnGpsProvider_1 = require("./platform/rnGpsProvider");
const rnBackgroundTask_1 = require("./platform/rnBackgroundTask");
const backgroundSession_1 = require("./services/backgroundSession");
/**
 * Runtime wiring:
 * - bind `geolocation` to your RN geolocation module
 * - bind `backgroundApi` to your preferred background-task library
 */
const geolocation = globalThis.geolocation;
const backgroundApi = globalThis
    .backgroundTaskApi;
if (!geolocation || !backgroundApi) {
    throw new Error("Missing geolocation/background adapters. Bind them before starting session.");
}
const gpsProvider = (0, rnGpsProvider_1.createRnGpsProvider)(geolocation);
const session = new backgroundSession_1.BackgroundSessionService(gpsProvider);
const task = new rnBackgroundTask_1.RnBackgroundTaskController(backgroundApi, session);
void task.start();
