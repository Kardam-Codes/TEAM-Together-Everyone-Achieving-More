// OWNER - HEET
// PURPOSE - Analytics screen: live trends and basic replay controls (v1).

import React, { useMemo, useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLive } from '../context/LiveContext';
import { LineChart } from '../components/common';
import { styles } from '../styles/appStyles';
import { palette, colorForStatus, softColorForStatus } from '../theme';

function TabButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: active ? palette.primarySoft : palette.surfaceMuted,
        borderWidth: 1,
        borderColor: active ? palette.primary : palette.border,
      }}
    >
      <Text style={{ color: active ? palette.primary : palette.textMuted, fontWeight: '900' }}>{label}</Text>
    </Pressable>
  );
}

function MetricsStrip() {
  const { selectedCamera } = useLive();
  const density = selectedCamera?.density || 0;
  const flow = selectedCamera?.entry_flow - selectedCamera?.exit_flow || 0;
  const exits = 4;

  const densityStatus = density > 3.5 ? 'danger' : density > 2.5 ? 'warning' : 'safe';
  const flowStatus = flow > 20 ? 'danger' : flow > 0 ? 'warning' : 'safe';

  return (
    <View style={[styles.metricStrip, { backgroundColor: palette.surface }]}>
      <View style={[styles.stripItem, { borderRightWidth: 1, borderRightColor: palette.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="people" size={14} color={colorForStatus(densityStatus)} />
          <Text style={styles.stripLabel}>DENSITY</Text>
        </View>
        <Text style={[styles.stripValue, { color: colorForStatus(densityStatus) }]}>{density.toFixed(1)}</Text>
        <Text style={styles.stripHelper}>persons/m²</Text>
      </View>
      <View style={[styles.stripItem, { borderRightWidth: 1, borderRightColor: palette.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="trending-up" size={14} color={colorForStatus(flowStatus)} />
          <Text style={styles.stripLabel}>FLOW</Text>
        </View>
        <Text style={[styles.stripValue, { color: colorForStatus(flowStatus) }]}>
          {flow > 0 ? '+' : ''}{Math.round(flow)}
        </Text>
        <Text style={styles.stripHelper}>per min</Text>
      </View>
      <View style={styles.stripItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="exit" size={14} color={colorForStatus('safe')} />
          <Text style={styles.stripLabel}>EXITS</Text>
        </View>
        <Text style={[styles.stripValue, { color: colorForStatus('safe') }]}>{exits}</Text>
        <Text style={styles.stripHelper}>open</Text>
      </View>
    </View>
  );
}

export function AnalyticsScreen() {
  const { live, tableName, selectedCamera, setReplay } = useLive();
  const [tab, setTab] = useState('Live');
  const [series, setSeries] = useState([]);

  const density = selectedCamera?.density;
  const score = selectedCamera?.pressure_score;

  useEffect(() => {
    if (typeof density !== 'number') return;
    setSeries(prev => [...prev, density].slice(-30));
  }, [density]);

  const dangerStatus = score > 75 ? 'danger' : score > 55 ? 'warning' : 'safe';

  const replayBtnStyle = [styles.secondaryButton, { flex: 1, borderWidth: 1, borderColor: palette.border }];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, { paddingBottom: 8 }]}>
        <Text style={styles.sectionTitle}>Analytics</Text>
        <Text style={styles.sectionSubtitle}>Corridor: {selectedCamera?.label || tableName}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TabButton label="Live" active={tab === 'Live'} onPress={() => setTab('Live')} />
          <TabButton label="Replay" active={tab === 'Replay'} onPress={() => setTab('Replay')} />
          <TabButton label="History" active={tab === 'History'} onPress={() => setTab('History')} />
        </View>
      </View>

      <MetricsStrip />

      {tab === 'Live' ? (
        <>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="analytics" size={20} color={palette.primary} />
                  <Text style={styles.sectionTitle}>Density Trend</Text>
                </View>
                <Text style={styles.sectionSubtitle}>Last {series.length} samples</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.incidentTitle, { fontSize: 20, color: colorForStatus(dangerStatus) }]}>
                  Score {typeof score === 'number' ? Math.round(score) : '--'}
                </Text>
                <Text style={styles.sectionSubtitle}>{score > 75 ? 'CRITICAL' : score > 55 ? 'WARNING' : 'STABLE'}</Text>
              </View>
            </View>
            <LineChart values={series.length ? series : [0, 0, 0, 0]} dangerAt={3.5} />
          </View>

          <View style={[styles.card, { marginTop: 8 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Quick Stats</Text>
            <View style={{ gap: 10 }}>
              <View style={styles.metricRow}>
                <View style={styles.metricLabelWrap}>
                  <Ionicons name="speedometer" size={16} color={palette.textMuted} />
                  <Text style={styles.metricRowLabel}>Avg Pressure</Text>
                </View>
                <Text style={styles.metricRowValue}>{score?.toFixed(1) || '--'}</Text>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metricLabelWrap}>
                  <Ionicons name="time" size={16} color={palette.textMuted} />
                  <Text style={styles.metricRowLabel}>Last Update</Text>
                </View>
                <Text style={styles.metricRowValue}>{selectedCamera?.timestamp || '--'}</Text>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metricLabelWrap}>
                  <Ionicons name="videocam" size={16} color={palette.textMuted} />
                  <Text style={styles.metricRowLabel}>Camera Status</Text>
                </View>
                <Text style={[styles.metricRowValue, { color: palette.safe }]}>ONLINE</Text>
              </View>
            </View>
          </View>
        </>
      ) : null}

      {tab === 'Replay' ? (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Ionicons name="play-circle" size={24} color={palette.primary} />
            <Text style={styles.sectionTitle}>Replay Controls</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Control backend stream (pause/seek/speed).</Text>

          <View style={{ marginTop: 14, gap: 10 }}>
            <Pressable onPress={() => setReplay({ mode: 'REPLAY', paused: false, speed: 1 })} style={styles.primaryButton}>
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={[styles.primaryButtonLabel, { color: '#FFFFFF' }]}>Start Replay</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable 
                onPress={() => setReplay({ paused: true })} 
                style={replayBtnStyle}
              >
                <Ionicons name="pause" size={16} color={palette.text} />
                <Text style={{ color: palette.text, fontWeight: '700' }}>Pause</Text>
              </Pressable>
              <Pressable 
                onPress={() => setReplay({ paused: false })} 
                style={replayBtnStyle}
              >
                <Ionicons name="play" size={16} color={palette.text} />
                <Text style={{ color: palette.text, fontWeight: '700' }}>Resume</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => setReplay({ speed: 0.5 })} style={replayBtnStyle}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>0.5×</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ speed: 1 })} style={replayBtnStyle}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>1×</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ speed: 2 })} style={replayBtnStyle}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>2×</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => setReplay({ seekIndex: 0 })} style={replayBtnStyle}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>Seek 0</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ mode: 'LIVE', paused: false, speed: 1 })} style={replayBtnStyle}>
                <Text style={{ color: palette.text, fontWeight: '700' }}>Back to Live</Text>
              </Pressable>
            </View>

            <Text style={{ color: palette.textSubtle, marginTop: 14 }}>
              Current: density {typeof density === 'number' ? density.toFixed(2) : '--'} · score {typeof score === 'number' ? score : '--'}
            </Text>
          </View>
        </View>
      ) : null}

      {tab === 'History' ? (
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
          <Ionicons name="document-text-outline" size={48} color={palette.textMuted} />
          <Text style={[styles.sectionTitle, { marginTop: 16, textAlign: 'center' }]}>History</Text>
          <Text style={[styles.sectionSubtitle, { textAlign: 'center' }]}>v1 placeholder: use Log screen for resolved events.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}