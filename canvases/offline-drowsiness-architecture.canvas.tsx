import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Table,
  Text,
} from "cursor/canvas";

const stateRows = [
  [
    "S0 Boot",
    "ESP32 starts camera/mic/speaker/buzzer and joins hotspot",
    "WiFi connected + mobile heartbeat detected",
    "S1 Monitor",
  ],
  [
    "S1 Monitor",
    "ESP32 streams frames, mobile computes EAR/MAR/PERCLOS",
    "Decision state changes to Drowsy/Fatigued",
    "S2 Alert",
  ],
  [
    "S2 Alert",
    "ESP32 buzzer + voice prompt: rest question",
    "Keyword YES/NO/GUIDE recognized",
    "S3 Route (YES/GUIDE) or S1 Monitor (NO)",
  ],
  [
    "S3 Route",
    "Mobile finds nearest rest area and sends turn-by-turn packets",
    "Arrival geofence hit",
    "S4 Rest Timer",
  ],
  [
    "S4 Rest Timer",
    "ESP32 runs 15-min reminder and 30-min max alarm",
    "Timer complete or driver resumes trip",
    "S1 Monitor",
  ],
];

const messageRows = [
  ["VIDEO_FRAME", "ESP32 -> Mobile", "jpeg chunkId, ts, fpsHint", "Continuous"],
  ["AUDIO_KEYWORD", "ESP32 -> Mobile", "keyword(YES/NO/GUIDE), confidence, ts", "On detect"],
  ["ALERT_TRIGGER", "Mobile -> ESP32", "state(Drowsy/Fatigued), severity", "Event"],
  ["VOICE_PROMPT", "Mobile -> ESP32", "clipId, priority", "Event"],
  ["NAV_STEP", "Mobile -> ESP32", "stepId, distanceM, action, etaSec", "1-2 sec"],
  ["ARRIVAL", "Mobile -> ESP32", "restAreaId, arrived=true", "Event"],
  ["REST_TIMER_CMD", "Mobile -> ESP32", "mode(15m|30m), startTs", "Event"],
  ["HEARTBEAT", "Both", "deviceId, battery, signal, appState", "1 sec"],
];

const thresholdsRows = [
  ["EAR", "Eye closure intensity", "Below threshold for >= 2s contributes to Drowsy"],
  ["MAR", "Yawning intensity", "Repeated high MAR events increase fatigue score"],
  ["PERCLOS", "Percent eye closure over window", "High PERCLOS classifies Fatigued"],
];

export default function OfflineDrowsinessArchitectureCanvas() {
  return (
    <Stack gap={20}>
      <H1>Offline Drowsiness Detection: ESP32-S3 + Mobile Architecture</H1>
      <Text tone="secondary">
        Hybrid safety system with strict role separation: ESP32 handles sensing interaction and output;
        mobile app handles AI inference, decision logic, and offline navigation.
      </Text>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader title="System Objectives" />
          <CardBody>
            <Stack gap={10}>
              <Text>Real-time drowsiness detection (EAR, MAR, PERCLOS)</Text>
              <Text>Immediate audio + buzzer intervention with minimal distraction</Text>
              <Text>Offline routing to nearest rest area in Olongapo City</Text>
              <Text>Continuous operation even when app is backgrounded</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Design Constraints" />
          <CardBody>
            <Stack gap={10}>
              <Text>No internet dependency; all inference and maps are local</Text>
              <Text>ESP32 does not run heavy CV/ML inference</Text>
              <Text>Voice interaction uses offline keyword spotting only</Text>
              <Text>Pre-recorded voice clips for low-latency reliable playback</Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Divider />
      <H2>Layered Architecture (Top-Down Data Flow)</H2>
      <Card>
        <CardBody>
          <Stack gap={12}>
            <Row gap={8}>
              <Pill tone="info">Driver</Pill>
              <Text>Responds to prompts via voice commands and follows spoken guidance</Text>
            </Row>
            <Row gap={8}>
              <Pill tone="info">Hardware Layer (ESP32-S3)</Pill>
              <Text>[Camera] frame capture, [Mic] keyword spotting, [Speaker] prompts, [Buzzer] urgent alarm</Text>
            </Row>
            <Row gap={8}>
              <Pill tone="info">Communication Layer</Pill>
              <Text>Local WiFi/Hotspot transport for stream + command bus (bidirectional)</Text>
            </Row>
            <Row gap={8}>
              <Pill tone="info">Mobile App Layer (React Native)</Pill>
              <Text>Session orchestration, local DB access, GPS tracking, route control</Text>
            </Row>
            <Row gap={8}>
              <Pill tone="warning">AI Processing Layer (Mobile)</Pill>
              <Text>Face detection → landmarks → EAR/MAR/PERCLOS extraction</Text>
            </Row>
            <Row gap={8}>
              <Pill tone="warning">Decision Layer (Mobile)</Pill>
              <Text>Classifies Alert / Drowsy / Fatigued and emits intervention policy</Text>
            </Row>
            <Row gap={8}>
              <Pill tone="success">Output Layer (ESP32 + Driver)</Pill>
              <Text>Alerts, voice question, navigation cues, rest timer reminders</Text>
            </Row>
          </Stack>
        </CardBody>
      </Card>

      <Divider />
      <H2>Bidirectional Workflow</H2>
      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader title="ESP32 -> Mobile (Upstream)" />
          <CardBody>
            <Stack gap={8}>
              <Text>1) Camera streams driver frames continuously</Text>
              <Text>2) Keyword events sent when YES/NO/GUIDE is detected</Text>
              <Text>3) Heartbeat includes device health and connectivity</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Mobile -> ESP32 (Downstream)" />
          <CardBody>
            <Stack gap={8}>
              <Text>1) Drowsiness alert command with severity</Text>
              <Text>2) Voice prompt clip IDs and navigation instruction packets</Text>
              <Text>3) Arrival and rest timer start/stop directives</Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <H3>Primary Control Loop</H3>
      <Text>
        Capture → AI Metrics → Decision → Alert Prompt → Voice Command → Route (optional) → Arrival → Rest
        Timer → Resume Monitoring.
      </Text>

      <Divider />
      <H2>System State Machine</H2>
      <Table
        headers={["State", "What Runs", "Transition Trigger", "Next State"]}
        rows={stateRows}
      />

      <Divider />
      <H2>Offline Message Contract</H2>
      <Table
        headers={["Message", "Direction", "Payload", "Frequency"]}
        rows={messageRows}
      />

      <Divider />
      <H2>Drowsiness Decision Design</H2>
      <Table
        headers={["Signal", "Meaning", "Rule"]}
        rows={thresholdsRows}
      />
      <Callout tone="info" title="Decision fusion recommendation">
        Use a weighted fatigue score over a sliding window (for example 30 to 60 seconds) to avoid false
        alarms from single-frame noise. Keep hard safety override: eyes closed continuously for 2+ seconds
        triggers immediate alert regardless of score.
      </Callout>

      <Divider />
      <H2>Failure Handling and Safety Fallbacks</H2>
      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader title="Connectivity Degraded" />
          <CardBody>
            <Stack gap={8}>
              <Text>ESP32 keeps buzzer and local voice warning active</Text>
              <Text>Mobile retries stream/control channel with backoff</Text>
              <Text>If disconnected beyond timeout, force caution message loop</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Face Not Detected / Poor Lighting" />
          <CardBody>
            <Stack gap={8}>
              <Text>Mobile sends "face lost" signal to ESP32</Text>
              <Text>ESP32 plays corrective prompt: adjust posture/lighting</Text>
              <Text>Persisting failure escalates to periodic caution alert</Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader title="Implementation Partition (What goes where)" />
        <CardBody>
          <Grid columns={2} gap={12}>
            <Stack gap={8}>
              <H3>ESP32-S3 Firmware</H3>
              <Text>Camera driver and frame transport</Text>
              <Text>Offline keyword spotting (YES/NO/GUIDE)</Text>
              <Text>Audio clip playback scheduler + buzzer control</Text>
              <Text>Rest timer (15-minute reminder, 30-minute hard alarm)</Text>
            </Stack>
            <Stack gap={8}>
              <H3>React Native Mobile App</H3>
              <Text>CV pipeline and landmark-based signal extraction</Text>
              <Text>Drowsiness/fatigue decision engine</Text>
              <Text>Offline nearest-rest-area search + navigation computation</Text>
              <Text>Session controller and instruction packet generator</Text>
            </Stack>
          </Grid>
        </CardBody>
      </Card>
    </Stack>
  );
}
