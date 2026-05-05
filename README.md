# Offline Drowsiness Detection System

Hybrid driver-safety system using an ESP32-S3 edge device and an offline-capable mobile application.

## Repository Structure

- `firmware/esp32-s3/` - ESP32-S3 edge interaction firmware (camera stream, keyword events, alerts, timer)
- `mobile-app/` - React Native app core modules (AI pipeline, decision engine, offline navigation)
- `shared/` - Message protocol contracts used by both layers

## Architecture Intent

- ESP32-S3 responsibilities:
  - camera frame capture and transport
  - keyword detection for `YES`, `NO`, `GUIDE`
  - buzzer + pre-recorded voice playback
  - rest timer (15-min reminder, 30-min hard alarm)
- Mobile app responsibilities:
  - face/landmark processing and EAR/MAR/PERCLOS computation
  - drowsiness state classification (`Alert`, `Drowsy`, `Fatigued`)
  - offline nearest-rest-area lookup and route-step generation
  - command orchestration toward ESP32

## MVP Loop

1. ESP32 sends video frames to mobile app.
2. Mobile computes metrics and decides driver state.
3. Mobile sends alert command if drowsy/fatigued.
4. ESP32 plays alert and listens for keyword.
5. If `YES` or `GUIDE`, mobile computes nearest rest area and emits voice nav steps.
6. ESP32 plays guidance and starts timer on arrival.
7. After timer, system returns to monitoring.

## Phase 2 Implemented

- WebSocket transport client for mobile-device message exchange:
  - `mobile-app/src/transport/deviceSocketClient.ts`
- Background-safe mobile session orchestrator:
  - `mobile-app/src/services/backgroundSession.ts`
- GPS-based arrival detection and correct timer start sequencing:
  - `mobile-app/src/orchestrator/systemOrchestrator.ts`
- ESP-IDF-oriented firmware app loop (`app_main`) and build scaffolding:
  - `firmware/esp32-s3/CMakeLists.txt`
  - `firmware/esp32-s3/src/CMakeLists.txt`
  - `firmware/esp32-s3/sdkconfig.defaults`

## Phase 3 Implemented

- ESP32 WebSocket endpoint scaffold on `esp_http_server`:
  - `firmware/esp32-s3/src/main.cpp`
  - inbound mobile command parsing and outbound JSON packet send flow
- React Native platform adapters:
  - `mobile-app/src/platform/rnGpsProvider.ts`
  - `mobile-app/src/platform/rnBackgroundTask.ts`
- AI pipeline upgraded to pluggable inference interface:
  - `mobile-app/src/ai/pipeline.ts`
  - supports external landmark estimator injection for MediaPipe/TFLite integration

## Next Integration Steps

1. Replace frame and keyword stubs in `firmware/esp32-s3/src/main.cpp` with real camera + KWS drivers.
2. Replace naive inbound JSON extraction with a robust JSON parser (`cJSON`/`json` component).
3. Bind real RN modules and remove `globalThis` placeholder injection in `mobile-app/src/index.ts`.
4. Implement MediaPipe/TFLite estimator and inject via `setLandmarkEstimator()` in `mobile-app/src/ai/pipeline.ts`.
5. Add persistent local storage for calibrated thresholds and rest-area metadata updates.

# eyelert