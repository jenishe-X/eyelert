import { BackgroundSessionService } from "../services/backgroundSession";

export interface BackgroundTaskApi {
  start(name: string, task: () => Promise<void>): Promise<void>;
  stop(name: string): Promise<void>;
  isRunning(name: string): boolean;
}

export class RnBackgroundTaskController {
  private running = false;
  private readonly taskName = "drowsiness-monitor";

  constructor(
    private readonly api: BackgroundTaskApi,
    private readonly session: BackgroundSessionService
  ) {}

  async start(): Promise<void> {
    if (this.running || this.api.isRunning(this.taskName)) return;
    await this.api.start(this.taskName, async () => {
      this.running = true;
      this.session.start();
    });
  }

  async stop(): Promise<void> {
    if (!this.running && !this.api.isRunning(this.taskName)) return;
    this.session.stop();
    await this.api.stop(this.taskName);
    this.running = false;
  }
}
