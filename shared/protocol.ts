export type DriverState = "Alert" | "Drowsy" | "Fatigued";
export type KeywordCommand = "YES" | "NO" | "GUIDE";

export interface BaseMessage {
  type: string;
  ts: number;
  sessionId: string;
}

export interface VideoFrameMessage extends BaseMessage {
  type: "VIDEO_FRAME";
  frameId: string;
  chunkId: number;
  totalChunks: number;
  jpegBase64: string;
}

export interface KeywordMessage extends BaseMessage {
  type: "AUDIO_KEYWORD";
  keyword: KeywordCommand;
  confidence: number;
}

export interface AlertTriggerMessage extends BaseMessage {
  type: "ALERT_TRIGGER";
  state: DriverState;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface VoicePromptMessage extends BaseMessage {
  type: "VOICE_PROMPT";
  clipId: string;
  priority: number;
}

export interface NavStepMessage extends BaseMessage {
  type: "NAV_STEP";
  stepId: string;
  action: "TURN_LEFT" | "TURN_RIGHT" | "CONTINUE" | "ARRIVE";
  distanceM: number;
  etaSec: number;
  phrase: string;
}

export interface ArrivalMessage extends BaseMessage {
  type: "ARRIVAL";
  restAreaId: string;
  arrived: true;
}

export interface RestTimerCommandMessage extends BaseMessage {
  type: "REST_TIMER_CMD";
  mode: "15M" | "30M";
  start: boolean;
}

export interface HeartbeatMessage extends BaseMessage {
  type: "HEARTBEAT";
  batteryPct?: number;
  signalDbm?: number;
  appState?: "ACTIVE" | "BACKGROUND";
}

export type DeviceToMobileMessage = VideoFrameMessage | KeywordMessage | HeartbeatMessage;

export type MobileToDeviceMessage =
  | AlertTriggerMessage
  | VoicePromptMessage
  | NavStepMessage
  | ArrivalMessage
  | RestTimerCommandMessage
  | HeartbeatMessage;
