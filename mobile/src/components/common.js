// OWNER - HEET
// PURPOSE - Shared UI pieces used by the mobile alert app screens.

import React, { useMemo } from 'react';
import { Pressable, Text, View, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { tabs } from '../data/incidentData';
import { styles } from '../styles/appStyles';
import { colorForStatus, palette, softColorForStatus } from '../theme';

export function StatusPill({ level, label }) {
  return (
    <View 
      accessibilityLabel={label}
      style={[styles.statusPill, { backgroundColor: softColorForStatus(level), borderColor: colorForStatus(level) }]}
    >
      <View style={[styles.statusDot, { backgroundColor: colorForStatus(level) }]} />
      <Text style={[styles.statusText, { color: colorForStatus(level) }]}>{label}</Text>
    </View>
  );
}

export function MetricRow({ label, value, status }) {
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

export function LineChart({ values, dangerAt }) {
  const chartWidth = Dimensions.get('window').width - 64;
  const chartHeight = 120;

  // react-native-chart-kit requires at least 2 data points to render properly
  let validValues = values && values.length > 0 ? values : [0];
  if (validValues.length === 1) {
    validValues = [validValues[0], validValues[0]];
  }
  const safeValues = validValues.map(v => (Number.isFinite(v) ? v : 0));
  
  const data = {
    labels: safeValues.map(() => ''),
    datasets: [
      {
        data: safeValues,
        color: (opacity = 1) => palette.primary,
        strokeWidth: 3,
      },
      {
        data: Array(safeValues.length).fill(dangerAt),
        color: (opacity = 1) => palette.dangerSoft,
        strokeWidth: 2,
        withScrollableDot: false,
      }
    ],
  };

  const chartConfig = {
    backgroundColor: palette.surface,
    backgroundGradientFrom: palette.surface,
    backgroundGradientTo: palette.surface,
    fillShadowGradientFrom: palette.primary,
    fillShadowGradientFromOpacity: 0.2,
    fillShadowGradientTo: palette.surface,
    fillShadowGradientToOpacity: 0,
    color: (opacity = 1) => palette.primary,
    strokeWidth: 3,
    useShadowColorFromDataset: false,
    propsForDots: { r: '0' },
    propsForBackgroundLines: { stroke: 'transparent' }
  };

  return (
    <View style={{ marginTop: 8, marginBottom: 8, alignItems: 'center' }}>
      <RNLineChart
        data={data}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        bezier
        style={{ paddingRight: 0, paddingLeft: 0 }}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        fromZero={true}
      />
    </View>
  );
}

export function BottomNavigation({ activeTab, onChange }) {
  // LEGACY — not mounted by active navigator
  const tabIcons = {
    alert: 'warning',
    actions: 'construct',
    metrics: 'analytics',
  };

  return (
    <View style={styles.bottomNav}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[styles.navItem, isActive ? styles.navItemActive : null]}
          >
            <Ionicons 
              name={tabIcons[tab.id] || 'ellipse'} 
              size={20} 
              color={isActive ? palette.primary : palette.textMuted} 
              style={{ marginBottom: 2 }}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}