// OWNER - HEET
// PURPOSE - Main screens and sections for the mobile alert app.

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { actions, trend as fallbackTrend, zones as fallbackZones } from '../data/incidentData';
import { styles } from '../styles/appStyles';
import { colorForStatus } from '../theme';
import { LineChart, MetricRow, StatusPill } from './common';

export function Header({ data }) {
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

export function AlertScreen({ data, onActions, zones, onSelectZone }) {
  const zoneData = Array.isArray(zones) && zones.length ? zones : fallbackZones;
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, styles.incidentCard]}>
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
          {data.reasons.map(reason => (
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
      <ZoneStatusList zones={zoneData} onSelectZone={onSelectZone} />
    </ScrollView>
  );
}

// DEPRECATED: Use ActionsScreen from ../screens/ActionsScreen.js instead
export function LegacyActionsScreen({ data }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Actions for {data.sector}</Text>
        <Text style={styles.sectionSubtitle}>
          {data.status}: {data.title.toLowerCase()} at {data.corridor}.
        </Text>
      </View>

      {actions.map(action => (
        <ActionCard key={action.id} action={action} />
      ))}
    </ScrollView>
  );
}

export function MetricsScreen({ data, trend }) {
  const values = Array.isArray(trend) && trend.length ? trend : fallbackTrend;
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
        <LineChart values={values} dangerAt={data.safeDensity} />
      </View>
    </ScrollView>
  );
}

function MetricStrip({ data }) {
  const metrics = [
    { label: 'Density', value: `${data.density}`, helper: `safe ${data.safeDensity}`, status: 'danger' },
    { label: 'Flow', value: data.flowImbalance, helper: 'entry vs exit', status: 'warning' },
    { label: 'Exits', value: data.exitRoutes, helper: 'available', status: 'safe' },
  ];

  return (
    <View style={styles.metricStrip}>
      {metrics.map(metric => (
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

function ZoneStatusList({ zones, onSelectZone }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Zone status</Text>
      <View style={styles.zoneList}>
        {zones.map(zone => (
          <Pressable
            key={zone.label}
            style={styles.zoneRow}
            onPress={() => (typeof onSelectZone === 'function' ? onSelectZone(zone.label) : null)}
          >
            <View style={styles.zoneLeft}>
              <View style={[styles.statusBar, { backgroundColor: colorForStatus(zone.status) }]} />
              <View>
                <Text style={styles.zoneName}>{zone.label}</Text>
                <Text style={styles.zoneArea}>{zone.area}</Text>
              </View>
            </View>
            <Text style={styles.zoneDensity}>{zone.density.toFixed(1)} people/m2</Text>
          </Pressable>
        ))}
      </View>
    </View>
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
          {action.primary ? 'Dispatch now' : 'Send instruction'}
        </Text>
      </Pressable>
    </View>
  );
}
