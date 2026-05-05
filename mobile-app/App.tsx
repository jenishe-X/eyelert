import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHint}>{hint}</Text>
    </View>
  );
}

function ControlButton({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "danger" | "success";
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.controlButton,
        variant === "danger" && styles.controlButtonDanger,
        variant === "success" && styles.controlButtonSuccess,
      ]}
    >
      <Text style={styles.controlButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>EYELERT</Text>
          <Text style={styles.subtitle}>Offline Drowsiness Monitor</Text>
        </View>

        <View style={styles.stateBar}>
          <Text style={styles.stateLabel}>Driver State</Text>
          <View style={styles.stateBadge}>
            <Text style={styles.stateBadgeText}>ALERT</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard label="EAR" value="0.24" hint="Eye openness normal" />
          <MetricCard label="MAR" value="0.33" hint="No yawn detected" />
          <MetricCard label="PERCLOS" value="0.12" hint="Low fatigue window" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Connection</Text>
          <View style={styles.panel}>
            <Text style={styles.panelRow}>ESP32-S3: Connected</Text>
            <Text style={styles.panelRow}>Camera Stream: 15 fps</Text>
            <Text style={styles.panelRow}>Mic Keyword Spotter: Ready</Text>
            <Text style={styles.panelRow}>Speaker + Buzzer: Armed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation Preview</Text>
          <View style={styles.panel}>
            <Text style={styles.panelRow}>Nearest rest area: Gordon Avenue Rest Spot</Text>
            <Text style={styles.panelRow}>Distance: 1.4 km</Text>
            <Text style={styles.panelRow}>Next instruction: Continue for 300 meters</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.controls}>
            <ControlButton label="Start Monitoring" variant="success" />
            <ControlButton label="Simulate Drowsy Alert" variant="danger" />
            <ControlButton label="Trigger Voice Prompt" />
            <ControlButton label="Start 15-Min Rest Timer" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  header: {
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 2,
    fontSize: 14,
  },
  stateBar: {
    backgroundColor: "#111827",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stateLabel: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
  },
  stateBadge: {
    backgroundColor: "#14532d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stateBadgeText: {
    color: "#dcfce7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 98,
  },
  metricLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },
  metricValue: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  metricHint: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 4,
  },
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  panel: {
    backgroundColor: "#111827",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  panelRow: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  controls: {
    gap: 10,
  },
  controlButton: {
    backgroundColor: "#1e293b",
    borderColor: "#475569",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  controlButtonDanger: {
    backgroundColor: "#7f1d1d",
    borderColor: "#ef4444",
  },
  controlButtonSuccess: {
    backgroundColor: "#166534",
    borderColor: "#22c55e",
  },
  controlButtonText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
