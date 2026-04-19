// OWNER - HEET
// PURPOSE - Dashboard screen: temple selector, pressure gauge, corridor mini-map list, and ack bar.

import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { ROLE_LABELS } from '../constants/roles';
import { PressureGauge } from '../components/PressureGauge';
import { styles } from '../styles/appStyles';
import { colorForStatus, palette } from '../theme';

function severityPill(severity) {
  const level = severity === 'DANGER' ? 'danger' : severity === 'WARNING' ? 'warning' : severity === 'WATCH' ? 'warning' : 'safe';
  return { level, label: severity || 'SAFE' };
}

function AckDot({ label, state }) {
  const ok = Boolean(state?.ackedAt);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: ok ? palette.safe : palette.warning,
        }}
      />
      <Text style={{ color: palette.textMuted, fontWeight: '800' }}>{label}</Text>
      <Text style={{ color: ok ? palette.safe : palette.warning, fontWeight: '800' }}>
        {ok ? 'Ack’d' : 'Pending'}
      </Text>
    </View>
  );
}

export function DashboardScreen() {
  const { role, username, logout } = useAuth();
  const { temples, templeId, setTempleId, live, tableName, setTableName, selectedCamera, globalSeverity, mostSevereAlert } = useLive();
  const { t } = useTranslation();

  const corridors = useMemo(() => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.corridors || [];
  }, [temples, templeId]);

  const severityUi = severityPill(globalSeverity);
  const score = selectedCamera?.pressure_score ?? 0;
  const countdown = selectedCamera?.crush_in ? `${String(selectedCamera.crush_in).padStart(2, '0')}:00` : '--:--';

  let roleDashboardKey = 'dashboard';
  if (role === 'POLICE') roleDashboardKey = 'policeDashboard';
  else if (role === 'TRANSPORT') roleDashboardKey = 'transportDashboard';
  else if (role === 'ADMIN') roleDashboardKey = 'adminDashboard';
  else if (role === 'TEMPLE_AGENCY') roleDashboardKey = 'agencyDashboard';

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 18 }]}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>{t(roleDashboardKey)}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Welcome, {username} · Temple: {templeId}
        </Text>

        {/* Summary Cards */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
          <View style={{ flex: 1, backgroundColor: palette.surfaceDark, padding: 15, borderRadius: 10 }}>
            <Text style={{ color: palette.textMuted, fontSize: 12 }}>{t('crowdDensity')}</Text>
            <Text style={{ color: palette.text, fontSize: 24, fontWeight: 'bold' }}>{score.toFixed(1)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: palette.surfaceDark, padding: 15, borderRadius: 10 }}>
            <Text style={{ color: palette.textMuted, fontSize: 12 }}>{t('activeAlerts')}</Text>
            <Text style={{ color: palette.danger, fontSize: 24, fontWeight: 'bold' }}>{mostSevereAlert ? 1 : 0}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: palette.surfaceDark, padding: 15, borderRadius: 10 }}>
            <Text style={{ color: palette.textMuted, fontSize: 12 }}>{t('activeCameras')}</Text>
            <Text style={{ color: palette.safe, fontSize: 24, fontWeight: 'bold' }}>{corridors.length}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {temples.map(t => (
            <Pressable
              key={t.id}
              onPress={() => setTempleId(t.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: t.id === templeId ? palette.primarySoft : palette.surfaceMuted,
                borderWidth: 1,
                borderColor: t.id === templeId ? palette.primary : palette.border,
              }}
            >
              <Text style={{ color: t.id === templeId ? palette.primary : palette.textMuted, fontWeight: '800' }}>
                {t.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {globalSeverity === 'DANGER' ? (
        <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: palette.danger }]}>
          <Text style={{ color: palette.danger, fontWeight: '900' }}>DANGER alert active</Text>
          <Text style={{ color: palette.textMuted, marginTop: 6 }}>
            Acknowledge in Alerts screen to clear your role’s pending status.
          </Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>{selectedCamera?.label || tableName || 'Corridor'}</Text>
            <Text style={styles.sectionSubtitle}>
              Global status: <Text style={{ color: colorForStatus(severityUi.level), fontWeight: '900' }}>{severityUi.label}</Text>
              {selectedCamera?.timestamp ? ` · ${selectedCamera.timestamp}` : ''}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <PressureGauge score={score} label="Pressure score" />
        </View>

        <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Predicted risk in</Text>
            <Text style={{ color: palette.danger, fontSize: 32, fontWeight: '900' }}>{countdown}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Classifier</Text>
            <Text style={{ color: palette.text, fontWeight: '900' }}>
              {selectedCamera?.status === 'SURGE' ? 'Momentary Surge' : selectedCamera?.status === 'CRUSH_BUILDUP' ? 'Genuine Buildup' : 'Stable'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Multi-corridor map (tap to select)</Text>
        <Text style={styles.sectionSubtitle}>List view for v1; can replace with schematic later.</Text>

        <View style={{ marginTop: 12, gap: 10 }}>
          {corridors.map(c => {
            const cam = live?.cameras?.[c.tableName];
            const sev = cam?.severity || 'SAFE';
            const level = sev === 'DANGER' ? 'danger' : sev === 'WARNING' ? 'warning' : sev === 'WATCH' ? 'warning' : 'safe';
            return (
              <Pressable
                key={c.id}
                onPress={() => setTableName(c.tableName)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: c.tableName === tableName ? palette.primary : palette.border,
                  backgroundColor: palette.surface,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.text, fontWeight: '900' }}>{c.label}</Text>
                  <Text style={{ color: palette.textMuted, marginTop: 3 }}>
                    {c.offline ? 'Offline' : `Score ${cam?.pressure_score ?? 0} · ${sev}`}
                  </Text>
                </View>
                <View style={{ width: 10, height: 40, borderRadius: 5, backgroundColor: colorForStatus(level) }} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Agency acknowledgements</Text>
        <Text style={styles.sectionSubtitle}>Current most severe alert</Text>

        {mostSevereAlert ? (
          <View style={{ marginTop: 12, gap: 10 }}>
            <AckDot label="Police" state={mostSevereAlert.acks?.POLICE} />
            <AckDot label="Temple" state={mostSevereAlert.acks?.TEMPLE_AGENCY} />
            <AckDot label="Transport" state={mostSevereAlert.acks?.TRANSPORT} />
          </View>
        ) : (
          <Text style={{ marginTop: 12, color: palette.textMuted }}>No active alerts.</Text>
        )}
      </View>
    </ScrollView>
  );
}

