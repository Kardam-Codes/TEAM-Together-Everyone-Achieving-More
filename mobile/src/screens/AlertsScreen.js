// OWNER - HEET
// PURPOSE - Alerts screen: list active/resolved alerts, show ack tracker, allow role-specific acknowledgement.

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { ROLE_LABELS } from '../constants/roles';
import { styles } from '../styles/appStyles';
import { colorForStatus, palette } from '../theme';

function severityLevel(severity) {
  if (severity === 'DANGER') return 'danger';
  if (severity === 'WARNING') return 'warning';
  if (severity === 'WATCH') return 'warning';
  return 'safe';
}

function AckRow({ label, ack }) {
  const ok = Boolean(ack?.ackedAt);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
      <Text style={{ color: palette.textMuted, fontWeight: '800' }}>{label}</Text>
      <Text style={{ color: ok ? palette.safe : palette.warning, fontWeight: '900' }}>
        {ok ? `Ack’d (${ack.responseSeconds}s)` : 'Pending'}
      </Text>
    </View>
  );
}

export function AlertsScreen() {
  const { role } = useAuth();
  const { alertsActive, alertsResolved, acknowledge } = useLive();
  const [tab, setTab] = useState('active');

  const list = tab === 'active' ? alertsActive : alertsResolved;

  const roleAckKey = role;

  const title = useMemo(() => (tab === 'active' ? 'Active Alerts' : 'Resolved Alerts'), [tab]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Alerts</Text>
        <Text style={styles.sectionSubtitle}>Role: {ROLE_LABELS[role]}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Pressable
            onPress={() => setTab('active')}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: tab === 'active' ? palette.primarySoft : palette.surfaceMuted,
              borderWidth: 1,
              borderColor: tab === 'active' ? palette.primary : palette.border,
            }}
          >
            <Text style={{ color: tab === 'active' ? palette.primary : palette.textMuted, fontWeight: '900' }}>Active</Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('resolved')}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: tab === 'resolved' ? palette.primarySoft : palette.surfaceMuted,
              borderWidth: 1,
              borderColor: tab === 'resolved' ? palette.primary : palette.border,
            }}
          >
            <Text style={{ color: tab === 'resolved' ? palette.primary : palette.textMuted, fontWeight: '900' }}>Resolved</Text>
          </Pressable>
        </View>
      </View>

      <Text style={{ color: palette.textMuted, fontWeight: '800', marginTop: 2 }}>{title}</Text>

      {list.map(alert => {
        const level = severityLevel(alert.severity);
        const ack = alert.acks?.[roleAckKey];
        const canAck = tab === 'active' && !ack?.ackedAt;

        return (
          <View key={alert.id} style={[styles.card, { borderLeftWidth: 5, borderLeftColor: colorForStatus(level) }]}>
            <View style={styles.rowBetween}>
              <Text style={{ color: colorForStatus(level), fontWeight: '900' }}>{alert.severity}</Text>
              <Text style={{ color: palette.textSubtle }}>{new Date(alert.createdAt).toLocaleTimeString()}</Text>
            </View>

            <Text style={{ color: palette.text, fontWeight: '900', marginTop: 10 }}>
              {alert.triggerSnapshot?.cctv_camera_location || alert.corridorId}
            </Text>
            <Text style={{ color: palette.textMuted, marginTop: 4 }}>
              Trigger: score {alert.triggerSnapshot?.pressure_score} · density {alert.triggerSnapshot?.density} · CPI {alert.triggerSnapshot?.cpi}
            </Text>

            {alert.predictedWindow ? (
              <Text style={{ color: palette.textMuted, marginTop: 6 }}>
                Risk window: {new Date(alert.predictedWindow.start).toLocaleTimeString()} – {new Date(alert.predictedWindow.end).toLocaleTimeString()}
              </Text>
            ) : (
              <Text style={{ color: palette.textMuted, marginTop: 6 }}>No risk window detected.</Text>
            )}

            <View style={{ marginTop: 10 }}>
              <AckRow label="Police" ack={alert.acks?.POLICE} />
              <AckRow label="Temple Trust" ack={alert.acks?.TEMPLE_STAFF} />
              <AckRow label="Transport" ack={alert.acks?.TRANSPORT} />
            </View>

            {canAck ? (
              <Pressable
                onPress={() => acknowledge(alert.id, role)}
                style={[styles.primaryButton, { marginTop: 14 }]}
              >
                <Text style={styles.primaryButtonText}>Acknowledge</Text>
                <Text style={styles.primaryButtonMeta}>As {ROLE_LABELS[role]}</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}

      {!list.length ? <Text style={{ color: palette.textMuted }}>No alerts.</Text> : null}
    </ScrollView>
  );
}

