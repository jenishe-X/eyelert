import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "./App.styles";

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
