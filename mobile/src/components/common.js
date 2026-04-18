// OWNER - HEET
// PURPOSE - Shared UI pieces used by the mobile alert app screens.

import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { tabs } from '../data/incidentData';
import { styles } from '../styles/appStyles';
import { colorForStatus, palette, softColorForStatus } from '../theme';

export function StatusPill({ level, label }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: softColorForStatus(level), borderColor: colorForStatus(level) }]}>
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

export function BottomNavigation({ activeTab, onChange }) {
  return (
    <View style={styles.bottomNav}>
      {tabs.map(tab => (
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
