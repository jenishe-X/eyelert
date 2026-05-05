#include <stdint.h>

#include <cstring>
#include <deque>
#include <string>

#include "esp_http_server.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char* TAG = "drowsiness-edge";

enum class DeviceState { BOOT, MONITOR, ALERT, ROUTING, REST_TIMER };

struct Message {
  std::string type;
  std::string payload;
};

class WsMessageBus {
 public:
  bool start() {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.uri_match_fn = httpd_uri_match_wildcard;

    if (httpd_start(&server_, &config) != ESP_OK) {
      ESP_LOGE(TAG, "Failed to start HTTP server");
      return false;
    }

    httpd_uri_t ws = {};
    ws.uri = "/ws";
    ws.method = HTTP_GET;
    ws.handler = &WsMessageBus::wsHandler;
    ws.user_ctx = this;
    ws.is_websocket = true;
    if (httpd_register_uri_handler(server_, &ws) != ESP_OK) {
      ESP_LOGE(TAG, "Failed to register websocket endpoint");
      return false;
    }
    ESP_LOGI(TAG, "WebSocket server ready at /ws");
    return true;
  }

  void stop() {
    if (server_) {
      httpd_stop(server_);
      server_ = nullptr;
    }
  }

  bool hasClient() const { return clientFd_ >= 0 && server_ != nullptr; }

  void sendJson(const std::string& json) {
    if (!hasClient()) return;
    httpd_ws_frame_t frame = {};
    frame.type = HTTPD_WS_TYPE_TEXT;
    frame.payload = reinterpret_cast<uint8_t*>(const_cast<char*>(json.c_str()));
    frame.len = json.size();
    if (httpd_ws_send_frame_async(server_, clientFd_, &frame) != ESP_OK) {
      ESP_LOGW(TAG, "Failed async send to client");
    }
  }

  bool pollInbound(Message& out) {
    if (inbound_.empty()) return false;
    out = inbound_.front();
    inbound_.pop_front();
    return true;
  }

 private:
  static esp_err_t wsHandler(httpd_req_t* req) {
    auto* self = static_cast<WsMessageBus*>(req->user_ctx);
    if (req->method == HTTP_GET) {
      self->clientFd_ = httpd_req_to_sockfd(req);
      ESP_LOGI(TAG, "WebSocket client connected (fd=%d)", self->clientFd_);
      return ESP_OK;
    }

    httpd_ws_frame_t frame = {};
    frame.type = HTTPD_WS_TYPE_TEXT;
    esp_err_t err = httpd_ws_recv_frame(req, &frame, 0);
    if (err != ESP_OK) return err;

    std::string payload;
    payload.resize(frame.len);
    frame.payload = reinterpret_cast<uint8_t*>(&payload[0]);
    err = httpd_ws_recv_frame(req, &frame, frame.len);
    if (err != ESP_OK) return err;

    Message msg = self->parseInbound(payload);
    if (!msg.type.empty()) self->inbound_.push_back(msg);
    return ESP_OK;
  }

  Message parseInbound(const std::string& json) const {
    Message msg;
    if (json.find("\"ALERT_TRIGGER\"") != std::string::npos) msg.type = "ALERT_TRIGGER";
    else if (json.find("\"VOICE_PROMPT\"") != std::string::npos) msg.type = "VOICE_PROMPT";
    else if (json.find("\"NAV_STEP\"") != std::string::npos) msg.type = "NAV_STEP";
    else if (json.find("\"ARRIVAL\"") != std::string::npos) msg.type = "ARRIVAL";
    else if (json.find("\"REST_TIMER_CMD\"") != std::string::npos) msg.type = "REST_TIMER_CMD";
    else if (json.find("\"HEARTBEAT\"") != std::string::npos) msg.type = "HEARTBEAT";
    msg.payload = extractJsonStringField(json, "phrase");
    if (msg.payload.empty()) msg.payload = extractJsonStringField(json, "clipId");
    return msg;
  }

  static std::string extractJsonStringField(const std::string& json, const char* field) {
    const std::string needle = std::string("\"") + field + "\":\"";
    const size_t start = json.find(needle);
    if (start == std::string::npos) return "";
    const size_t valueStart = start + needle.size();
    const size_t end = json.find("\"", valueStart);
    if (end == std::string::npos) return "";
    return json.substr(valueStart, end - valueStart);
  }

  httpd_handle_t server_ = nullptr;
  int clientFd_ = -1;
  std::deque<Message> inbound_;
};

class RestTimer {
 public:
  void start15m(uint64_t nowMs) {
    active_ = true;
    reminded_ = false;
    reminderMs_ = nowMs + 15ULL * 60ULL * 1000ULL;
    maxMs_ = nowMs + 30ULL * 60ULL * 1000ULL;
  }

  bool shouldRemind(uint64_t nowMs) const { return active_ && nowMs >= reminderMs_ && !reminded_; }
  bool shouldAlarm(uint64_t nowMs) const { return active_ && nowMs >= maxMs_; }
  void markReminded() { reminded_ = true; }
  void stop() { active_ = false; }

 private:
  bool active_ = false;
  bool reminded_ = false;
  uint64_t reminderMs_ = 0;
  uint64_t maxMs_ = 0;
};

class EdgeInteractionController {
 public:
  void setup() {
    initWifiApClient();
    initWebSocketServer();
    initCamera();
    initKeywordSpotter();
    initAudioOutput();
    initBuzzer();
    state_ = DeviceState::MONITOR;
    ESP_LOGI(TAG, "Edge controller ready.");
  }

  void loop() {
    const uint64_t nowMs = static_cast<uint64_t>(esp_timer_get_time() / 1000ULL);

    if (state_ == DeviceState::MONITOR) {
      captureAndSendFrame();
      detectKeywordAndSendEvent();
    }

    Message inbound;
    while (pollMobileMessage(inbound)) {
      handleInbound(inbound, nowMs);
    }

    if (state_ == DeviceState::REST_TIMER) {
      if (restTimer_.shouldRemind(nowMs)) {
        playClip("rest_15_minute_reminder");
        restTimer_.markReminded();
      }
      if (restTimer_.shouldAlarm(nowMs)) {
        buzzerOn();
        playClip("rest_30_minute_alarm");
      }
    }
  }

 private:
  DeviceState state_ = DeviceState::BOOT;
  RestTimer restTimer_;
  WsMessageBus wsBus_;
  int frameCounter_ = 0;

  void handleInbound(const Message& msg, uint64_t nowMs) {
    if (msg.type == "ALERT_TRIGGER") {
      state_ = DeviceState::ALERT;
      buzzerOn();
      playClip("prompt_drowsy_rest_question");
      return;
    }
    if (msg.type == "VOICE_PROMPT") {
      playClip(msg.payload);
      return;
    }
    if (msg.type == "NAV_STEP") {
      state_ = DeviceState::ROUTING;
      playClip(msg.payload);
      return;
    }
    if (msg.type == "ARRIVAL" || msg.type == "REST_TIMER_CMD") {
      state_ = DeviceState::REST_TIMER;
      restTimer_.start15m(nowMs);
      playClip("arrived_start_rest");
      return;
    }
    if (msg.type == "HEARTBEAT") {
      return;
    }
  }

  void initWifiApClient() {
    // TODO: configure STA/AP mode and join local mobile hotspot.
  }

  void initWebSocketServer() { wsBus_.start(); }
  void initCamera() {}
  void initKeywordSpotter() {}
  void initAudioOutput() {}
  void initBuzzer() {}

  void captureAndSendFrame() {
    // TODO: replace this placeholder base64 with real JPEG frame payload.
    const std::string frame =
        "{\"type\":\"VIDEO_FRAME\",\"ts\":0,\"sessionId\":\"edge-session\",\"frameId\":\"f" +
        std::to_string(frameCounter_++) +
        "\",\"chunkId\":0,\"totalChunks\":1,\"jpegBase64\":\"\"}";
    wsBus_.sendJson(frame);
  }

  void detectKeywordAndSendEvent() {
    // TODO: call this when YES/NO/GUIDE is detected by offline KWS model.
    // Example:
    // wsBus_.sendJson("{\"type\":\"AUDIO_KEYWORD\",\"ts\":0,\"sessionId\":\"edge-session\","
    //                "\"keyword\":\"YES\",\"confidence\":0.92}");
  }

  bool pollMobileMessage(Message& out) {
    return wsBus_.pollInbound(out);
  }

  void buzzerOn() {}
  void playClip(const std::string& clipId) { (void)clipId; }
};

extern "C" void app_main(void) {
  EdgeInteractionController controller;
  controller.setup();
  while (true) {
    controller.loop();
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}
