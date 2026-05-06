import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
