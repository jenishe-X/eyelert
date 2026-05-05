"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RnBackgroundTaskController = void 0;
class RnBackgroundTaskController {
    constructor(api, session) {
        this.api = api;
        this.session = session;
        this.running = false;
        this.taskName = "drowsiness-monitor";
    }
    async start() {
        if (this.running || this.api.isRunning(this.taskName))
            return;
        await this.api.start(this.taskName, async () => {
            this.running = true;
            this.session.start();
        });
    }
    async stop() {
        if (!this.running && !this.api.isRunning(this.taskName))
            return;
        this.session.stop();
        await this.api.stop(this.taskName);
        this.running = false;
    }
}
exports.RnBackgroundTaskController = RnBackgroundTaskController;
