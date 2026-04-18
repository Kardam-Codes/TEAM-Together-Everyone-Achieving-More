// OWNER - HEET
// PURPOSE - Analytics screen: live trends and basic replay controls (v1).

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useLive } from '../context/LiveContext';
import { LineChart } from '../components/common';
import { styles } from '../styles/appStyles';
import { palette } from '../theme';

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

export function AnalyticsScreen() {
  const { live, tableName, selectedCamera, setReplay } = useLive();
  const [tab, setTab] = useState('Live');
  const [series, setSeries] = useState([]);

  const density = selectedCamera?.density;
  const score = selectedCamera?.pressure_score;

  // build a small rolling series in-memory for charts
  useMemo(() => {
    if (typeof density !== 'number') return;
    setSeries(prev => [...prev, density].slice(-30));
  }, [density]);

  const scoreSeries = useMemo(() => {
    const cameras = live?.cameras || {};
    const s = cameras?.[tableName]?.pressure_score;
    return typeof s === 'number' ? s : 0;
  }, [live, tableName]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Analytics</Text>
        <Text style={styles.sectionSubtitle}>Corridor: {selectedCamera?.label || tableName}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TabButton label="Live" active={tab === 'Live'} onPress={() => setTab('Live')} />
          <TabButton label="Replay" active={tab === 'Replay'} onPress={() => setTab('Replay')} />
          <TabButton label="History" active={tab === 'History'} onPress={() => setTab('History')} />
        </View>
      </View>

      {tab === 'Live' ? (
        <>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionTitle}>Density trend</Text>
                <Text style={styles.sectionSubtitle}>Last {series.length} samples</Text>
              </View>
              <Text style={{ color: palette.textMuted, fontWeight: '900' }}>Score {Math.round(scoreSeries)}</Text>
            </View>
            <LineChart values={series.length ? series : [0, 0, 0, 0]} dangerAt={3.5} />
          </View>
        </>
      ) : null}

      {tab === 'Replay' ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Replay</Text>
          <Text style={styles.sectionSubtitle}>Controls backend stream (pause/seek/speed).</Text>

          <View style={{ marginTop: 14, gap: 10 }}>
            <Pressable onPress={() => setReplay({ mode: 'REPLAY', paused: false, speed: 1 })} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start Replay</Text>
              <Text style={styles.primaryButtonMeta}>Mode REPLAY</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => setReplay({ paused: true })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>Pause</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ paused: false })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>Resume</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => setReplay({ speed: 0.5 })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>0.5×</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ speed: 1 })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>1×</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ speed: 2 })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>2×</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => setReplay({ seekIndex: 0 })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>Seek 0</Text>
              </Pressable>
              <Pressable onPress={() => setReplay({ mode: 'LIVE', paused: false, speed: 1 })} style={[styles.secondaryButton, { flex: 1, marginTop: 0 }]}>
                <Text style={styles.secondaryText}>Back to Live</Text>
              </Pressable>
            </View>
          </View>

          <Text style={{ color: palette.textSubtle, marginTop: 14 }}>
            Current: density {typeof density === 'number' ? density.toFixed(2) : '--'} · score {typeof score === 'number' ? score : '--'}
          </Text>
        </View>
      ) : null}

      {tab === 'History' ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>History</Text>
          <Text style={styles.sectionSubtitle}>v1 placeholder: use Log screen for resolved events.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

