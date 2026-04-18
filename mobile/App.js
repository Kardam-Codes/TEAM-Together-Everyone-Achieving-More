import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const colors = {
  bg: "#0F1115",
  surface: "#1A1D23",
  surfaceLow: "#111317",
  surfaceHigh: "#242830",
  surfaceHighest: "#333539",
  border: "#30363D",
  borderSoft: "#2A2F36",
  text: "#E2E2E8",
  muted: "#C4C7C8",
  dim: "#8E9192",
  danger: "#C62828",
  error: "#FFB4AB",
  errorContainer: "#93000A",
  primary: "#ACCBDA",
  primaryContainer: "#4F6D7A",
  onPrimaryContainer: "#CEEefd",
  secondary: "#C4C6CE",
  tertiary: "#EBBD9D",
  slate900: "#0F172A",
  slate800: "#1E293B",
  slate700: "#334155",
  slate500: "#64748B",
};

const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdxz__HebWzrGOLxkN713UV2rq25nXj9BCYFIZ3qTUlqXLdxX4L4x0Mqxot_87kjXl1taTreuSg1dAHYgMmBVe198UfTiAmS4pYTl6rmRKmqiuEZaqOAkdWH2EMUHctAyDnXASMRoofTRtqhu4i_71dCKLCqGcNK8nMgi_yX6fcofzChOxWGotP-fSw0pv3t-PqB-SV6Hv93bx0Ue_Sye2rnm1i_6fxkz7dvIL-6H1euq8uL-gFN2xyJg-piVlrGe_qIAaVHTVFQo";

const feedImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCzknyH09bgUcDIG2-GbkMh1M7TbqxwhThlGBHlK-_vxDxfHQcVJB8EzzVgunI-F99glfQs6FCh-Dd-Su-X4t4aF_2snAQtVxqB-RJsNVc4c0jqMhRwN4UAj6wD7ua3yuj8BXjpcniA0XyU5cIMV3--At3Q5BU0EgDJRYuYmFw3lMZmNgJBS15P56SvbGAMty9ajcWOtuCanQShwAQdMIBzTB8NeW-IzdhjJ14K2_-Szuodvwqu0aLNI3wP7rwTwW4EDph--awiNPo";

const heatmapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBKuNHJGk4vkSXvKMIuvy4QxCSzAyRSQZQ0Rr-b6edAHalGdW7gGQjmhxQz-RI_WjyFEQU6cLtcREGRVDsOF0lNQrJWSr7ke5z7DUGxOhnpSWBKVvvXsM7dm0jmojJKGImBaZM_eNBuO4WiVj66oNBOIbqTwzFZG1y_nWYxDRVSaI1vH6SXhnZ4BECk_L8m7BGxFQ7YQjWK-E6wQUeqbNQil0tlpabrhnKILx8UtXkAst8LnxUwbdi-mC8pF-emIvgwtylIKM65iVg";

export default function App() {
  const [screen, setScreen] = useState("monitor");

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {screen === "monitor" && <AlertHome onNavigate={setScreen} />}
      {screen === "details" && <AlertDetails onNavigate={setScreen} />}
      {screen === "action" && <ActionScreen onNavigate={setScreen} />}
      {screen === "metrics" && <MetricsScreen onNavigate={setScreen} />}
    </SafeAreaView>
  );
}

function AlertHome({ onNavigate }) {
  return (
    <View style={styles.fullScreen}>
      <ImageBackground source={{ uri: mapImage }} style={styles.absoluteFill} imageStyle={styles.fadedImage} />
      <CommandHeader title="Ambaji Corridor A" />

      <View style={styles.alertHomeMain}>
        <View style={styles.statusCore}>
          <View style={styles.circleWrap}>
            <View style={styles.ringGlow} />
            <View style={styles.dangerCircle}>
              <Text style={styles.warningIcon}>!</Text>
              <Text style={styles.dangerText}>DANGER</Text>
            </View>
          </View>

          <View style={styles.telemetryBlock}>
            <Text style={styles.alertTitle}>Crush risk in 8 minutes</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerDanger}>07:54</Text>
            </View>
          </View>

          <View style={styles.contextCard}>
            <Text style={styles.contextIcon}>GW</Text>
            <View style={styles.flexOne}>
              <Text style={styles.cardKicker}>Current Density</Text>
              <Text style={styles.bodyMuted}>4.8 people/m2 - Critical threshold exceeded in Sector 4.</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.homeBottom}>
        <View style={styles.primaryActionWrap}>
          <Pressable style={styles.whiteButton} onPress={() => onNavigate("action")}>
            <Text style={styles.whiteButtonText}>View Response Actions</Text>
            <Text style={styles.whiteButtonText}>-&gt;</Text>
          </Pressable>
        </View>
        <Pressable style={styles.sheetHint} onPress={() => onNavigate("details")}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetHintText}>Swipe for system overview</Text>
        </Pressable>
        <BottomNav active="monitor" onNavigate={onNavigate} />
      </View>
    </View>
  );
}

function AlertDetails({ onNavigate }) {
  return (
    <View style={styles.fullScreen}>
      <View style={styles.dimBackground}>
        <CommandHeader title="CENTRAL_COMMAND / ACTIVE_ZONE" simple />
        <View style={styles.feedContent}>
          <View style={styles.feedCard}>
            <View style={styles.rowBetween}>
              <Text style={[styles.cardKicker, styles.errorText]}>Critical Alert</Text>
              <Text style={styles.labelMuted}>ZONE A-14</Text>
            </View>
            <Text style={styles.feedTitle}>Pressure Spike Detected</Text>
            <ImageBackground source={{ uri: feedImage }} style={styles.feedImage} imageStyle={styles.feedImageStyle} />
          </View>
          <View style={styles.twoColumns}>
            <MetricTile label="Cameras" value="12 ACTIVE" />
            <MetricTile label="Personnel" value="4 ON-SITE" />
          </View>
        </View>
      </View>

      <View style={styles.overlay} />

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandleCentered}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.sheetBody}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.cardKickerMuted}>Pressure Index</Text>
              <View style={styles.baselineRow}>
                <Text style={styles.pressureScore}>88</Text>
                <Text style={styles.pressureTotal}>/100</Text>
              </View>
            </View>
            <View style={styles.trendBadge}>
              <Text style={styles.errorText}>UP +12%</Text>
            </View>
          </View>

          <View style={styles.twoColumns}>
            <MetricTile label="Density" value="3.8 people/m2" />
            <MetricTile label="Flow Rate" value="180 /min" />
          </View>

          <View style={styles.graphSection}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardKicker}>Live Trend</Text>
              <Text style={styles.labelMuted}>Last 15 minutes</Text>
            </View>
            <MiniTrendGraph danger />
          </View>

          <View style={styles.sheetActions}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>ACKNOWLEDGE</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>DISPATCH</Text>
            </Pressable>
          </View>
        </View>

        <BottomNav active="alerts" onNavigate={onNavigate} />
      </View>
    </View>
  );
}

function ActionScreen({ onNavigate }) {
  return (
    <View style={styles.fullScreen}>
      <TopAppBar title="Central Station" subtitle="AGENCY RESPONSE" right="LIVE MONITORING" />
      <ScrollView contentContainerStyle={styles.actionScroll}>
        <View style={styles.criticalAlert}>
          <View style={styles.alertSummaryLeft}>
            <Text style={styles.warningSmall}>!</Text>
            <View style={styles.flexOne}>
              <Text style={styles.alertSummaryTitle}>High Pressure Detected</Text>
              <Text style={styles.alertSummaryBody}>Response required within 90 seconds. System lockdown protocol active.</Text>
            </View>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.alertSummaryLabel}>TIME REMAINING</Text>
            <Text style={styles.alertSummaryTime}>00:74</Text>
          </View>
        </View>

        <View style={styles.panelStack}>
          <ResponsePanel
            icon="SH"
            title="Police"
            body="Crowd control unit 04 in vicinity."
            status="Awaiting Deployment"
            button="Deploy Officers"
            accent={colors.primary}
          />
          <ResponsePanel
            icon="TM"
            title="Temple Authority"
            body="Main gate flow: 140 ppm. Capacity exceeded."
            status="Entry Open"
            button="Hold Entry / Stop Darshan"
            accent={colors.tertiary}
          />
          <ResponsePanel
            icon="BS"
            title="Transport Control"
            body="Incoming shuttle queue: 12 vehicles."
            status="Acknowledged - 00:12s"
            button="Hold Incoming Vehicles"
            accent={colors.secondary}
            disabled
          />
        </View>

        <View style={styles.bentoRow}>
          <MetricCard title="CROWD DENSITY" value="8.4" suffix=" p/m2" tone={colors.error} progress={84} />
          <MetricCard title="EVACUATION ROUTES" value="CLEAR" body="4/4 ACTIVE" tone={colors.primary} />
          <MetricCard title="COMMUNICATIONS" value="STABLE" body="ENCRYPTED L3" tone={colors.secondary} />
        </View>
      </ScrollView>

      <View style={styles.responseLog}>
        <View style={styles.logLeft}>
          <Text style={styles.logMuted}>RESPONSE LOG:</Text>
          <Text style={styles.logText}>POL: <Text style={styles.errorText}>PENDING</Text></Text>
          <Text style={styles.logText}>TMPL: <Text style={styles.errorText}>PENDING</Text></Text>
          <Text style={styles.logText}>TRNS: <Text style={styles.primaryText}>OK 12s</Text></Text>
        </View>
        <View style={styles.logRight}>
          <Text style={styles.logTimer}>00:16.42</Text>
          <Text style={styles.urgentBadge}>URGENT</Text>
        </View>
      </View>
      <MainBottomNav active="action" onNavigate={onNavigate} />
    </View>
  );
}

function MetricsScreen({ onNavigate }) {
  return (
    <View style={styles.fullScreen}>
      <TopAppBar title="Central Station" right="LIVE MONITORING" />
      <ScrollView contentContainerStyle={styles.metricsScroll}>
        <View style={styles.metricsHeader}>
          <Text style={styles.metricsTitle}>System Metrics</Text>
          <Text style={styles.metricsSubtitle}>REAL-TIME TELEMETRY FEED // STATION SECTOR 7-B</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricPanel, styles.tallPanel]}>
            <Text style={styles.panelLabel}>Pressure Index</Text>
            <View style={styles.baselineRow}>
              <Text style={styles.bigMetric}>32</Text>
              <Text style={styles.labelMuted}>PSI / AVG</Text>
            </View>
            <View style={styles.nominalBadge}>
              <View style={styles.squareDot} />
              <Text style={[styles.panelLabel, { color: colors.tertiary }]}>NOMINAL OPERATING RANGE</Text>
            </View>
          </View>

          <View style={styles.metricPanel}>
            <Text style={styles.panelLabel}>Environmental Dynamics</Text>
            <View style={styles.metricRows}>
              <InlineMetric label="Crowd Density" value="4.2" suffix="p/m2" progress={70} />
              <InlineMetric label="Flow Rate" value="128" suffix="p/min" progress={45} />
              <InlineMetric label="Corridor Width" value="12.5" suffix="m" progress={100} muted />
            </View>
          </View>

          <View style={styles.metricPanel}>
            <View style={styles.rowBetweenTop}>
              <View>
                <Text style={styles.panelLabel}>Pressure over time</Text>
                <Text style={styles.risingText}>RISING TREND DETECTED (+14%)</Text>
              </View>
              <View style={styles.tagRow}>
                <Text style={styles.liveTag}>LIVE</Text>
                <Text style={styles.outlineTag}>24H</Text>
              </View>
            </View>
            <LargeTrendGraph />
          </View>

          <View style={styles.metricPanel}>
            <Text style={styles.panelLabel}>Vehicle Arrival Burst</Text>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleIcon}>TR</Text>
              <View>
                <Text style={styles.vehicleMetric}>T-MINUS 04:12</Text>
                <Text style={styles.labelMuted}>PLATFORM 4 - CAPACITY 88%</Text>
              </View>
            </View>
            <View style={styles.incomingBar}>
              <View style={styles.incomingFill} />
              <Text style={styles.incomingText}>INCOMING: SECTOR 7 CARGO EX</Text>
            </View>
          </View>

          <ImageBackground source={{ uri: heatmapImage }} style={styles.heatmapCard} imageStyle={styles.heatmapImage}>
            <View style={styles.heatmapShade}>
              <Text style={styles.heatmapTitle}>Spatial Heatmap</Text>
              <Text style={styles.bodyMuted}>Sector 7-B Real-time spatial occupancy visualization.</Text>
            </View>
            <Text style={styles.congestionBadge}>CONGESTION ALERT</Text>
          </ImageBackground>
        </View>
      </ScrollView>

      <MainBottomNav active="metrics" onNavigate={onNavigate} />
    </View>
  );
}

function CommandHeader({ title, simple }) {
  return (
    <View style={styles.commandHeader}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerIcon}>LOC</Text>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.headerRight}>
        {!simple && <View style={styles.liveDot} />}
        {!simple && <Text style={styles.liveText}>LIVE MONITORING</Text>}
        <Text style={styles.headerIcon}>SNS</Text>
      </View>
    </View>
  );
}

function TopAppBar({ title, subtitle, right }) {
  return (
    <View style={styles.topAppBar}>
      <View style={styles.headerLeft}>
        <Text style={styles.stationTitle}>{title}</Text>
        {subtitle ? <View style={styles.verticalRule} /> : null}
        {subtitle ? <Text style={styles.topSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ? (
        <Pressable style={styles.monitorBadge}>
          <Text style={styles.monitorBadgeText}>{right}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function BottomNav({ active, onNavigate }) {
  return (
    <View style={styles.bottomNav}>
      <NavItem label="MONITOR" icon="M" active={active === "monitor"} onPress={() => onNavigate("monitor")} />
      <NavItem label="ALERTS" icon="!" active={active === "alerts"} onPress={() => onNavigate("details")} />
      <NavItem label="SYSTEM" icon="S" active={false} onPress={() => onNavigate("metrics")} />
    </View>
  );
}

function MainBottomNav({ active, onNavigate }) {
  return (
    <View style={styles.mainBottomNav}>
      <NavItem label="Dashboard" icon="D" active={active === "dashboard"} onPress={() => onNavigate("monitor")} />
      <NavItem label="Action" icon="!" active={active === "action"} onPress={() => onNavigate("action")} />
      <NavItem label="Metrics" icon="MT" active={active === "metrics"} onPress={() => onNavigate("metrics")} />
    </View>
  );
}

function NavItem({ label, icon, active, onPress }) {
  return (
    <Pressable style={[styles.navItem, active && styles.navItemActive]} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navTextActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navTextActive]}>{label}</Text>
    </Pressable>
  );
}

function MetricTile({ label, value }) {
  return (
    <View style={styles.metricTile}>
      <Text style={styles.labelMutedUpper}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

function ResponsePanel({ icon, title, body, status, button, accent, disabled }) {
  return (
    <View style={styles.responsePanel}>
      <View style={styles.panelInfo}>
        <View style={styles.panelIconBox}>
          <Text style={[styles.panelIconText, { color: accent }]}>{icon}</Text>
        </View>
        <View style={styles.flexOne}>
          <Text style={[styles.responseTitle, { color: accent }]}>{title}</Text>
          <Text style={styles.bodyMuted}>{body}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: disabled ? colors.tertiary : colors.error }]} />
            <Text style={[styles.statusText, { color: disabled ? colors.tertiary : colors.error }]}>{status}</Text>
          </View>
        </View>
      </View>
      <Pressable style={[styles.deployButton, disabled && styles.deployButtonDisabled]} disabled={disabled}>
        <Text style={[styles.deployButtonText, disabled && styles.deployButtonTextDisabled]}>{button}</Text>
      </Pressable>
    </View>
  );
}

function MetricCard({ title, value, suffix, body, tone, progress }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.panelLabel}>{title}</Text>
      <Text style={[styles.metricCardValue, { color: tone }]}>
        {value}
        {suffix ? <Text style={styles.metricSuffix}>{suffix}</Text> : null}
      </Text>
      {body ? <Text style={[styles.metricBody, { color: tone }]}>{body}</Text> : null}
      {progress ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: tone }]} />
        </View>
      ) : null}
    </View>
  );
}

function InlineMetric({ label, value, suffix, progress, muted }) {
  return (
    <View style={styles.inlineMetric}>
      <Text style={styles.inlineMetricLabel}>{label}</Text>
      <Text style={styles.inlineMetricValue}>
        {value} <Text style={styles.metricSuffix}>{suffix}</Text>
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: muted ? colors.slate500 : colors.primary }]} />
      </View>
    </View>
  );
}

function MiniTrendGraph({ danger }) {
  return (
    <View style={styles.miniGraph}>
      <View style={[styles.graphGrid, { top: 28 }]} />
      <View style={[styles.graphGrid, { top: 64 }]} />
      <View style={[styles.graphGrid, { top: 100 }]} />
      <View style={[styles.graphSegment, styles.segmentA, danger && styles.graphDanger]} />
      <View style={[styles.graphSegment, styles.segmentB, danger && styles.graphDanger]} />
      <View style={[styles.graphSegment, styles.segmentC, danger && styles.graphDanger]} />
      <View style={[styles.graphSegment, styles.segmentD, danger && styles.graphDanger]} />
      <View style={styles.currentPoint} />
    </View>
  );
}

function LargeTrendGraph() {
  return (
    <View style={styles.largeGraph}>
      <View style={[styles.graphGrid, { top: 52 }]} />
      <View style={[styles.graphGrid, { top: 104 }]} />
      <View style={[styles.graphGrid, { top: 156 }]} />
      <View style={[styles.largeSegment, styles.largeSegA]} />
      <View style={[styles.largeSegment, styles.largeSegB]} />
      <View style={[styles.largeSegment, styles.largeSegC]} />
      <View style={[styles.largeSegment, styles.largeSegD]} />
      <View style={[styles.largePoint, { right: 48, top: 38 }]} />
      <View style={[styles.largePoint, { right: 6, top: 28 }]} />
      <View style={styles.axisLabels}>
        {["06:00", "12:00", "18:00", "00:00", "NOW"].map((label) => (
          <Text key={label} style={styles.axisLabel}>{label}</Text>
        ))}
      </View>
    </View>
  );
}

const type = {
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  fadedImage: {
    opacity: 0.1,
  },
  commandHeader: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  alertHomeMain: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 176,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCore: {
    width: "100%",
    alignItems: "center",
    gap: 32,
  },
  circleWrap: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  ringGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: colors.danger,
    opacity: 0.22,
  },
  dangerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 12,
    borderColor: colors.danger,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  warningIcon: {
    color: colors.danger,
    fontSize: 52,
    fontWeight: "900",
    lineHeight: 58,
  },
  dangerText: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "800",
  },
  telemetryBlock: {
    alignItems: "center",
    gap: 8,
  },
  alertTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },
  timerBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  timerDanger: {
    color: colors.danger,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  contextCard: {
    width: "100%",
    maxWidth: 384,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  contextIcon: {
    color: colors.muted,
    fontWeight: "800",
  },
  flexOne: {
    flex: 1,
  },
  cardKicker: {
    ...type.label,
    color: "#FFFFFF",
  },
  cardKickerMuted: {
    ...type.label,
    color: colors.muted,
    marginBottom: 4,
  },
  bodyMuted: {
    ...type.body,
    color: colors.muted,
  },
  homeBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  primaryActionWrap: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  whiteButton: {
    height: 48,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  whiteButtonText: {
    color: colors.bg,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  sheetHint: {
    height: 48,
    backgroundColor: colors.surfaceHigh,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: "center",
    paddingTop: 4,
  },
  dragHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  sheetHintText: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  bottomNav: {
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
  },
  mainBottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    paddingHorizontal: 8,
    backgroundColor: "#0F172A",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: {
    minWidth: 90,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    backgroundColor: colors.surfaceHigh,
    borderTopWidth: 4,
    borderTopColor: "#FFFFFF",
  },
  navIcon: {
    color: colors.slate500,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  navLabel: {
    color: colors.slate500,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  navTextActive: {
    color: "#FFFFFF",
  },
  dimBackground: {
    flex: 1,
    opacity: 0.45,
  },
  feedContent: {
    paddingTop: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  feedCard: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: 16,
    gap: 8,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBetweenTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  errorText: {
    color: colors.error,
  },
  primaryText: {
    color: colors.primary,
  },
  labelMuted: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  labelMutedUpper: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  feedTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700",
  },
  feedImage: {
    height: 96,
    backgroundColor: colors.surfaceLow,
    overflow: "hidden",
  },
  feedImageStyle: {
    opacity: 0.35,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 16,
  },
  metricTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  tileValue: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  dragHandleCentered: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  sheetBody: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  baselineRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  pressureScore: {
    color: colors.error,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "800",
  },
  pressureTotal: {
    color: colors.muted,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700",
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,180,171,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,180,171,0.2)",
  },
  graphSection: {
    gap: 8,
  },
  miniGraph: {
    height: 128,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  graphGrid: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.85,
  },
  graphSegment: {
    position: "absolute",
    height: 2,
    backgroundColor: colors.primary,
  },
  graphDanger: {
    backgroundColor: colors.error,
  },
  segmentA: {
    left: 6,
    top: 100,
    width: 90,
    transform: [{ rotate: "-8deg" }],
  },
  segmentB: {
    left: 86,
    top: 84,
    width: 92,
    transform: [{ rotate: "-18deg" }],
  },
  segmentC: {
    right: 74,
    top: 52,
    width: 88,
    transform: [{ rotate: "-28deg" }],
  },
  segmentD: {
    right: 0,
    top: 25,
    width: 82,
    transform: [{ rotate: "-12deg" }],
  },
  currentPoint: {
    position: "absolute",
    right: -2,
    top: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  sheetActions: {
    flexDirection: "row",
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    ...type.label,
    color: "#2F3131",
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#464950",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    ...type.label,
    color: "#FFFFFF",
  },
  topAppBar: {
    height: 64,
    paddingHorizontal: 24,
    backgroundColor: colors.slate900,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate800,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationTitle: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  verticalRule: {
    width: 1,
    height: 16,
    backgroundColor: colors.slate700,
    marginHorizontal: 8,
  },
  topSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  monitorBadge: {
    backgroundColor: colors.primaryContainer,
    borderWidth: 1,
    borderColor: colors.slate700,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monitorBadgeText: {
    color: colors.onPrimaryContainer,
    fontSize: 11,
    fontWeight: "800",
  },
  actionScroll: {
    padding: 24,
    paddingBottom: 176,
    gap: 24,
  },
  criticalAlert: {
    backgroundColor: colors.errorContainer,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  alertSummaryLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  warningSmall: {
    color: "#FFDAD6",
    fontSize: 24,
    fontWeight: "900",
  },
  alertSummaryTitle: {
    color: "#FFDAD6",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  alertSummaryBody: {
    color: "#FFDAD6",
    opacity: 0.9,
    fontSize: 13,
    lineHeight: 18,
  },
  alignRight: {
    alignItems: "flex-end",
  },
  alertSummaryLabel: {
    ...type.label,
    color: "#FFDAD6",
  },
  alertSummaryTime: {
    color: "#FFDAD6",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  panelStack: {
    gap: 16,
  },
  responsePanel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 16,
    gap: 16,
  },
  panelInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  panelIconBox: {
    backgroundColor: colors.surfaceHighest,
    padding: 8,
    minWidth: 40,
    alignItems: "center",
  },
  panelIconText: {
    fontWeight: "900",
  },
  responseTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
  },
  statusText: {
    ...type.label,
  },
  deployButton: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  deployButtonDisabled: {
    backgroundColor: colors.surfaceHighest,
    borderWidth: 1,
    borderColor: colors.dim,
    opacity: 0.5,
  },
  deployButtonText: {
    ...type.label,
    color: colors.onPrimaryContainer,
  },
  deployButtonTextDisabled: {
    color: colors.muted,
  },
  bentoRow: {
    gap: 16,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 124,
  },
  panelLabel: {
    ...type.label,
    color: colors.slate500,
    marginBottom: 8,
  },
  metricCardValue: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "800",
  },
  metricSuffix: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  metricBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: colors.surfaceHighest,
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
  },
  responseLog: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 80,
    backgroundColor: colors.slate900,
    borderTopWidth: 1,
    borderTopColor: colors.slate800,
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  logLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  logMuted: {
    ...type.label,
    color: colors.slate500,
  },
  logText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
  },
  logRight: {
    alignItems: "flex-end",
  },
  logTimer: {
    color: "#F1F5F9",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  urgentBadge: {
    ...type.label,
    color: colors.errorContainer,
    backgroundColor: colors.error,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  metricsScroll: {
    padding: 24,
    paddingBottom: 112,
    gap: 32,
  },
  metricsHeader: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: 16,
  },
  metricsTitle: {
    color: "#94A3B8",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  metricsSubtitle: {
    color: colors.slate500,
    fontSize: 13,
    lineHeight: 18,
  },
  metricsGrid: {
    gap: 24,
  },
  metricPanel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 24,
  },
  tallPanel: {
    minHeight: 200,
    justifyContent: "space-between",
  },
  bigMetric: {
    color: colors.primary,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "800",
  },
  nominalBadge: {
    marginTop: 16,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  squareDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.tertiary,
  },
  metricRows: {
    gap: 24,
  },
  inlineMetric: {
    gap: 8,
  },
  inlineMetricLabel: {
    ...type.label,
    color: "#CBD5E1",
  },
  inlineMetricValue: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  risingText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
  },
  liveTag: {
    color: "#94A3B8",
    backgroundColor: colors.slate800,
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  outlineTag: {
    color: colors.slate500,
    borderWidth: 1,
    borderColor: colors.slate700,
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  largeGraph: {
    height: 256,
    marginTop: 20,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderSoft,
  },
  largeSegment: {
    position: "absolute",
    height: 3,
    backgroundColor: colors.primary,
  },
  largeSegA: {
    left: 8,
    top: 154,
    width: 92,
    transform: [{ rotate: "-8deg" }],
  },
  largeSegB: {
    left: 90,
    top: 136,
    width: 104,
    transform: [{ rotate: "-18deg" }],
  },
  largeSegC: {
    right: 112,
    top: 88,
    width: 116,
    transform: [{ rotate: "-22deg" }],
  },
  largeSegD: {
    right: 6,
    top: 44,
    width: 116,
    transform: [{ rotate: "-15deg" }],
  },
  largePoint: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
  },
  axisLabels: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -26,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  axisLabel: {
    color: "#475569",
    fontSize: 10,
    fontWeight: "700",
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  vehicleIcon: {
    color: colors.primary,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
  },
  vehicleMetric: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  incomingBar: {
    height: 32,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  incomingFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "88%",
    backgroundColor: colors.primaryContainer,
    opacity: 0.5,
  },
  incomingText: {
    color: colors.onPrimaryContainer,
    fontSize: 10,
    fontWeight: "800",
  },
  heatmapCard: {
    minHeight: 240,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heatmapImage: {
    opacity: 0.35,
  },
  heatmapShade: {
    padding: 24,
    backgroundColor: "rgba(26,29,35,0.82)",
  },
  heatmapTitle: {
    color: "#F1F5F9",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  congestionBadge: {
    position: "absolute",
    top: 24,
    right: 24,
    color: "#690005",
    backgroundColor: colors.error,
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
