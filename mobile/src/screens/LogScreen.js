// OWNER - HEET
// PURPOSE - Log/Event archive: show resolved alerts and allow basic client-side filtering; allow adding temple/corridor placeholders.

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useLive } from '../context/LiveContext';
import { styles } from '../styles/appStyles';
import { palette } from '../theme';
import { getResolvedApiBaseUrl } from '../api/liveClient';

export function LogScreen() {
  const { logs, temples } = useLive();
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(l => (l.severity || '').toLowerCase().includes(q) || (l.templeId || '').toLowerCase().includes(q));
  }, [logs, filter]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Log</Text>
        <Text style={styles.sectionSubtitle}>Resolved events (in-memory, resets on backend restart)</Text>
        <Text style={{ color: palette.textSubtle, marginTop: 8 }}>API: {getResolvedApiBaseUrl()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filters</Text>
        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Filter by severity or templeId…"
          placeholderTextColor={palette.textSubtle}
          style={{
            marginTop: 12,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.surfaceMuted,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: palette.text,
          }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Temples</Text>
        <Text style={styles.sectionSubtitle}>Somnath is data-backed; others are offline placeholders in v1.</Text>
        <View style={{ marginTop: 12, gap: 8 }}>
          {temples.map(t => (
            <View key={t.id} style={{ padding: 12, borderWidth: 1, borderColor: palette.border, borderRadius: 10 }}>
              <Text style={{ color: palette.text, fontWeight: '900' }}>{t.name}</Text>
              <Text style={{ color: palette.textMuted, marginTop: 3 }}>id: {t.id}</Text>
              <Text style={{ color: palette.textSubtle, marginTop: 3 }}>
                corridors: {(t.corridors || []).length}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ color: palette.textSubtle, marginTop: 12 }}>
          Add Temple/Add CCTV forms can be added next (backend endpoints exist).
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Events</Text>
        {!filtered.length ? <Text style={{ color: palette.textMuted, marginTop: 8 }}>No resolved events yet.</Text> : null}
        <View style={{ marginTop: 12, gap: 10 }}>
          {filtered.map(l => (
            <View key={l.id} style={{ padding: 12, borderWidth: 1, borderColor: palette.border, borderRadius: 10 }}>
              <Text style={{ color: palette.text, fontWeight: '900' }}>
                {l.severity} · peak {l.peakPressureScore}
              </Text>
              <Text style={{ color: palette.textMuted, marginTop: 4 }}>
                {l.templeId} · alert {l.alertId}
              </Text>
              <Text style={{ color: palette.textSubtle, marginTop: 4 }}>
                {l.createdAt ? new Date(l.createdAt).toLocaleString() : ''} → {l.resolvedAt ? new Date(l.resolvedAt).toLocaleString() : ''}
              </Text>
              {l.resolutionSummary ? (
                <Text style={{ color: palette.textMuted, marginTop: 6 }}>{l.resolutionSummary}</Text>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

