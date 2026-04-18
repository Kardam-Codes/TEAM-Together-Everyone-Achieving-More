import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const palette = {
  background: "#F4F6F8",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF2F5",
  surfaceDark: "#17202A",
  text: "#16202A",
  textMuted: "#5B6773",
  textSubtle: "#7A8793",
  border: "#D8DEE5",
  danger: "#C62828",
  dangerSoft: "#FDECEC",
  warning: "#B26A00",
  warningSoft: "#FFF4DE",
  safe: "#1B7F4C",
  safeSoft: "#EAF7EF",
  inactive: "#98A2AD",
  inactiveSoft: "#EDF0F2",
  primary: "#2457A6",
  primarySoft: "#E8F0FE",
};

const incident = {
  status: "Danger",
  statusLevel: "danger",
  temple: "Somnath Temple",
  corridor: "Main Entry Gate",
  sector: "Sector 4",
  title: "Crowd density rising",
  predictedRiskIn: "08:00",
  density: 4.8,
  safeDensity: 3.5,
  flowImbalance: "+31 people/min",
  exitRoutes: "4 open",
  updatedAt: "04:23 live",
  reasons: [
    "Density is above safe limit.",
    "More people are entering than exiting.",
    "Walking speed is dropping.",
  ],
};

const zones = [
  { label: "Sector 4", area: "Main Entry Gate", status: "danger", density: 4.8 },
  { label: "Corridor A", area: "North corridor", status: "warning", density: 3.7 },
  { label: "Queue Lane", area: "Holding area", status: "safe", density: 2.4 },
];

const actions = [
  {
    id: "police",
    title: "Dispatch police unit",
    target: "Sector 4 / Main Entry Gate",
    owner: "Police Control",
    note: "Move crowd-control unit 04 to the entry checkpoint.",
    primary: true,
  },
  {
    id: "entry",
    title: "Pause entry",
    target: "Main Entry Gate",
    owner: "Temple Authority",
    note: "Hold incoming visitors for 5 minutes.",
  },
  {
    id: "transport",
    title: "Hold shuttles",
    target: "Transport queue",
    owner: "Transport Control",
    note: "Delay new arrivals until density drops.",
  },
];

const trend = [2.7, 2.9, 3.2, 3.4, 3.8, 4.1, 4.5, 4.8];

export default function App() {
  const [activeTab, setActiveTab] = useState("alert");

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={palette.surfaceDark} />
      <Header data={incident} />

      <View style={styles.content}>
        {activeTab === "alert" ? <AlertScreen data={incident} onActions={() => setActiveTab("actions")} /> : null}
        {activeTab === "actions" ? <ActionsScreen data={incident} /> : null}
        {activeTab === "metrics" ? <MetricsScreen data={incident} /> : null}
      </View>

      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}

function Header({ data }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.appName}>Stampede Prediction</Text>
        <Text style={styles.place}>{data.temple}</Text>
        <Text style={styles.path}>
          {data.corridor} / {data.sector}
        </Text>
      </View>
      <StatusPill level={data.statusLevel} label={data.status} />
    </View>
  );
}

function AlertScreen({ data, onActions }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, styles.incidentCard]}>
        {/* Keep the main incident card short: location, issue, timer, reasons, action. */}
        <View style={styles.rowBetween}>
          <StatusPill level={data.statusLevel} label={data.status} />
          <Text style={styles.updatedAt}>{data.updatedAt}</Text>
        </View>

        <Text style={styles.incidentTitle}>{data.title}</Text>
        <Text style={styles.incidentLocation}>
          {data.corridor}, {data.sector}
        </Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>Predicted risk in</Text>
          <Text style={styles.timerValue}>{data.predictedRiskIn}</Text>
        </View>

        <View style={styles.reasonList}>
          {data.reasons.map((reason) => (
            <View key={reason} style={styles.reasonRow}>
              <View style={styles.reasonDot} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={onActions}>
          <Text style={styles.primaryButtonText}>Dispatch police unit</Text>
          <Text style={styles.primaryButtonMeta}>Sector 4 / Main Entry Gate</Text>
        </Pressable>
      </View>

      <MetricStrip data={data} />
      <ZoneStatusList />
    </ScrollView>
  );
}

function MetricStrip({ data }) {
  const metrics = [
    { label: "Density", value: `${data.density}`, helper: `safe ${data.safeDensity}`, status: "danger" },
    { label: "Flow", value: data.flowImbalance, helper: "entry vs exit", status: "warning" },
    { label: "Exits", value: data.exitRoutes, helper: "available", status: "safe" },
  ];

  return (
    <View style={styles.metricStrip}>
      {metrics.map((metric) => (
        <View key={metric.label} style={styles.stripItem}>
          <View style={[styles.smallDot, { backgroundColor: colorForStatus(metric.status) }]} />
          <Text style={styles.stripLabel}>{metric.label}</Text>
          <Text style={styles.stripValue}>{metric.value}</Text>
          <Text style={styles.stripHelper}>{metric.helper}</Text>
        </View>
      ))}
    </View>
  );
}

function ZoneStatusList() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Zone status</Text>
      <View style={styles.zoneList}>
        {zones.map((zone) => (
          <View key={zone.label} style={styles.zoneRow}>
            <View style={styles.zoneLeft}>
              <View style={[styles.statusBar, { backgroundColor: colorForStatus(zone.status) }]} />
              <View>
                <Text style={styles.zoneName}>{zone.label}</Text>
                <Text style={styles.zoneArea}>{zone.area}</Text>
              </View>
            </View>
            <Text style={styles.zoneDensity}>{zone.density.toFixed(1)} people/m2</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ActionsScreen({ data }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Actions for {data.sector}</Text>
        <Text style={styles.sectionSubtitle}>
          {data.status}: {data.title.toLowerCase()} at {data.corridor}.
        </Text>
      </View>

      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </ScrollView>
  );
}

function ActionCard({ action }) {
  return (
    <View style={[styles.card, action.primary ? styles.primaryActionCard : styles.actionCard]}>
      <View style={styles.actionTop}>
        <View style={styles.actionCopy}>
          <Text style={styles.actionOwner}>{action.owner}</Text>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionTarget}>{action.target}</Text>
          <Text style={styles.actionNote}>{action.note}</Text>
        </View>
        {action.primary ? <Text style={styles.primaryTag}>Primary</Text> : null}
      </View>

      <Pressable style={action.primary ? styles.dispatchButton : styles.secondaryButton}>
        <Text style={action.primary ? styles.dispatchText : styles.secondaryText}>
          {action.primary ? "Dispatch now" : "Send instruction"}
        </Text>
      </Pressable>
    </View>
  );
}

function MetricsScreen({ data }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key metrics</Text>
        <MetricRow label="Crowd density" value={`${data.density} people/m2`} status="danger" />
        <MetricRow label="Safe density" value={`${data.safeDensity} people/m2`} status="inactive" />
        <MetricRow label="Flow imbalance" value={data.flowImbalance} status="warning" />
        <MetricRow label="Exit routes" value={data.exitRoutes} status="safe" />
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>Density trend</Text>
            <Text style={styles.sectionSubtitle}>Last 8 minutes</Text>
          </View>
          <Text style={styles.warningLabel}>Rising</Text>
        </View>
        <LineChart values={trend} dangerAt={data.safeDensity} />
      </View>
    </ScrollView>
  );
}

function MetricRow({ label, value, status }) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricLabelWrap}>
        <View style={[styles.smallDot, { backgroundColor: colorForStatus(status) }]} />
        <Text style={styles.metricRowLabel}>{label}</Text>
      </View>
      <Text style={styles.metricRowValue}>{value}</Text>
    </View>
  );
}

function LineChart({ values, dangerAt }) {
  const points = useMemo(() => {
    const min = Math.min(...values, 0);
    const max = Math.max(...values, dangerAt);
    const range = max - min || 1;

    return values.map((value, index) => ({
      left: `${(index / (values.length - 1)) * 100}%`,
      bottom: `${((value - min) / range) * 76 + 10}%`,
      danger: value >= dangerAt,
      value,
    }));
  }, [dangerAt, values]);

  return (
    <View style={styles.chart}>
      <View style={styles.thresholdLine} />
      <Text style={styles.thresholdText}>safe limit</Text>
      {points.map((point, index) => (
        <View
          key={`${point.value}-${index}`}
          style={[
            styles.chartPoint,
            {
              left: point.left,
              bottom: point.bottom,
              backgroundColor: point.danger ? palette.danger : palette.primary,
            },
          ]}
        />
      ))}
      <View style={styles.chartLabels}>
        <Text style={styles.chartLabel}>-8 min</Text>
        <Text style={styles.chartLabel}>now</Text>
      </View>
    </View>
  );
}

function StatusPill({ level, label }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: softColorForStatus(level), borderColor: colorForStatus(level) }]}>
      <View style={[styles.statusDot, { backgroundColor: colorForStatus(level) }]} />
      <Text style={[styles.statusText, { color: colorForStatus(level) }]}>{label}</Text>
    </View>
  );
}

function BottomNavigation({ activeTab, onChange }) {
  const tabs = [
    { id: "alert", label: "Alert" },
    { id: "actions", label: "Actions" },
    { id: "metrics", label: "Metrics" },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          style={[styles.navItem, activeTab === tab.id && styles.navItemActive]}
        >
          <Text style={[styles.navLabel, activeTab === tab.id && styles.navLabelActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function colorForStatus(status) {
  if (status === "danger") {
    return palette.danger;
  }
  if (status === "warning") {
    return palette.warning;
  }
  if (status === "safe") {
    return palette.safe;
  }
  return palette.inactive;
}

function softColorForStatus(status) {
  if (status === "danger") {
    return palette.dangerSoft;
  }
  if (status === "warning") {
    return palette.warningSoft;
  }
  if (status === "safe") {
    return palette.safeSoft;
  }
  return palette.inactiveSoft;
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    backgroundColor: palette.surfaceDark,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    color: "#AEB8C2",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  place: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    marginTop: 3,
  },
  path: {
    color: "#D5DCE3",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 14,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
  },
  incidentCard: {
    borderLeftWidth: 5,
    borderLeftColor: palette.danger,
    gap: 14,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  updatedAt: {
    color: palette.textSubtle,
    fontSize: 12,
    lineHeight: 16,
  },
  incidentTitle: {
    color: palette.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
  },
  incidentLocation: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  timerBox: {
    backgroundColor: palette.dangerSoft,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F4C9C9",
    padding: 14,
  },
  timerLabel: {
    color: palette.danger,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  timerValue: {
    color: palette.danger,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  reasonList: {
    gap: 8,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  reasonDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.danger,
    marginTop: 7,
  },
  reasonText: {
    flex: 1,
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    padding: 15,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },
  primaryButtonMeta: {
    color: "#DDE9FF",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  metricStrip: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: "row",
    overflow: "hidden",
  },
  stripItem: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: palette.border,
  },
  smallDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginBottom: 6,
  },
  stripLabel: {
    color: palette.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  stripValue: {
    color: palette.text,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    marginTop: 2,
  },
  stripHelper: {
    color: palette.textSubtle,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  zoneList: {
    marginTop: 12,
    gap: 12,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  zoneLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  statusBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
  },
  zoneName: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  zoneArea: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  zoneDensity: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  actionCard: {
    borderLeftWidth: 5,
    borderLeftColor: palette.inactive,
  },
  primaryActionCard: {
    borderColor: palette.primary,
    borderLeftWidth: 5,
    borderLeftColor: palette.primary,
  },
  actionTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCopy: {
    flex: 1,
  },
  actionOwner: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  actionTitle: {
    color: palette.text,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    marginTop: 3,
  },
  actionTarget: {
    color: palette.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  actionNote: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  primaryTag: {
    color: palette.primary,
    backgroundColor: palette.primarySoft,
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  dispatchButton: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  dispatchText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    gap: 12,
  },
  metricLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricRowLabel: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  metricRowValue: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },
  warningLabel: {
    color: palette.warning,
    backgroundColor: palette.warningSoft,
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  chart: {
    height: 170,
    backgroundColor: "#FBFCFE",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 14,
    padding: 12,
    position: "relative",
  },
  thresholdLine: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: "47%",
    height: 1,
    backgroundColor: palette.warning,
  },
  thresholdText: {
    position: "absolute",
    right: 14,
    bottom: "48%",
    color: palette.warning,
    fontSize: 11,
    lineHeight: 14,
    backgroundColor: "#FBFCFE",
    paddingHorizontal: 4,
  },
  chartPoint: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: -5,
  },
  chartLabels: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartLabel: {
    color: palette.textSubtle,
    fontSize: 11,
    lineHeight: 14,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  navItem: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    backgroundColor: palette.primarySoft,
  },
  navLabel: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  navLabelActive: {
    color: palette.primary,
  },
});
