import React, { useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { ROLE_LABELS } from '../constants/roles';
import { styles } from '../styles/appStyles';
import { colorForStatus, palette, bgColorForStatus, softColorForStatus } from '../theme';

function severityLevel(severity) {
  if (severity === 'DANGER') return 'danger';
  if (severity === 'WARNING') return 'warning';
  if (severity === 'WATCH') return 'warning';
  return 'safe';
}

function AlertPill({ level, priority }) {
  const color = colorForStatus(level);
  const bg = softColorForStatus(level);
  const icon = level === 'danger' ? 'alert-circle' : level === 'warning' ? 'warning' : 'checkmark-circle';
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <View style={[styles.alertPill, { backgroundColor: bg, borderColor: color }]}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[styles.alertPillText, { color }]}>{level === 'danger' ? 'DANGER' : level === 'warning' ? 'WARNING' : 'SAFE'}</Text>
      </View>
      {priority && (
        <View style={[styles.alertPill, { backgroundColor: palette.surfaceDark, borderColor: palette.border }]}>
          <Text style={[styles.alertPillText, { color: priority === 'High' ? palette.danger : palette.warning }]}>{priority} Priority</Text>
        </View>
      )}
    </View>
  );
}

function CountdownTimer({ time }) {
  const [pulseAnim] = useState(new Animated.Value(1));
  
  React.useEffect(() => {
    let anim;
    if (time) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      anim.start();
    }
    return () => { anim?.stop(); };
  }, [time]);

  const color = palette.danger;
  return (
    <View style={[styles.countdownBox, { backgroundColor: palette.dangerBg, borderColor: palette.danger }]}>
      <Ionicons name="time" size={32} color={color} style={styles.countdownIcon} />
      <Text style={[styles.countdownValue, { color }]}>{time || '--:--'}</Text>
      <Text style={[styles.countdownLabel, { color: palette.textMuted }]}>RISK WINDOW</Text>
    </View>
  );
}

function MetricCard({ icon, label, value, trend, status, color }) {
  const statusColor = color || colorForStatus(status);
  const bg = softColorForStatus(status);
  const trendIcon = trend > 0 ? 'arrow-up' : trend < 0 ? 'arrow-down' : 'remove';
  const trendColor = trend > 0 ? palette.danger : trend < 0 ? palette.safe : palette.textMuted;
  return (
    <View style={[styles.metricCard, { backgroundColor: bg }]}>
      <View style={[styles.metricCardIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={statusColor} />
      </View>
      <View style={styles.metricCardContent}>
        <Text style={[styles.metricCardLabel, { color: palette.textMuted }]}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={[styles.metricCardValue, { color: statusColor }]}>{value}</Text>
          <Ionicons name={trendIcon} size={14} color={trendColor} style={styles.metricCardTrend} />
        </View>
      </View>
    </View>
  );
}

function ReasonItem({ reason, expanded }) {
  const icon = 'ellipse';
  return (
    <View style={styles.reasonItemNew}>
      <Ionicons name={icon} size={10} color={palette.danger} style={styles.reasonIcon} />
      <Text style={[styles.reasonContent, { color: palette.text }]}>{reason}</Text>
    </View>
  );
}

export function AlertsScreen() {
  const { role } = useAuth();
  const { alertsActive, alertsResolved, acknowledge, notifyAuthorities, mostSevereAlert, live, liveError } = useLive();
  const [tab, setTab] = useState('active');
  const [reasonsExpanded, setReasonsExpanded] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const list = tab === 'active' ? alertsActive : alertsResolved;
  const activeAlert = mostSevereAlert;

  const handleAcknowledge = async () => {
    if (!activeAlert || dispatched) return;
    setButtonPressed(true);
    try {
      await acknowledge(activeAlert.id, role);
      setDispatched(true);
    } finally {
      setTimeout(() => setButtonPressed(false), 200);
    }
  };

  const title = useMemo(() => (tab === 'active' ? 'Active Alerts' : 'Resolved Alerts'), [tab]);
  const level = severityLevel(activeAlert?.severity);
  const priority = activeAlert?.severity === 'DANGER' ? 'High' : activeAlert?.severity === 'WARNING' ? 'Medium' : 'Low';

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Alerts</Text>
          {liveError && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <ActivityIndicator size="small" color={palette.warning} />
              <Text style={{ color: palette.warning, fontSize: 12, fontWeight: 'bold' }}>Reconnecting...</Text>
            </View>
          )}
        </View>
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

      {!live && liveError ? (
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={{ color: palette.text, marginTop: 15, fontWeight: 'bold' }}>Fetching real-time data...</Text>
          <Text style={{ color: palette.danger, marginTop: 5, textAlign: 'center' }}>{liveError}</Text>
        </View>
      ) : activeAlert && tab === 'active' ? (
        <>
          <AlertPill level={level} priority={priority} />
          
          <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: colorForStatus(level) }]}>
            <Text style={{ color: palette.text, fontWeight: '900', fontSize: 22, marginBottom: 4 }}>
              {activeAlert.triggerSnapshot?.cctv_camera_location || activeAlert.corridorId || 'Unknown Location'}
            </Text>
            <Text style={{ color: palette.textMuted }}>
              Alert #{activeAlert.id?.slice(-6) || '0000'} · {new Date(activeAlert.createdAt).toLocaleTimeString()}
            </Text>
          </View>

          <CountdownTimer 
            time={activeAlert.predictedWindow 
              ? `${new Date(activeAlert.predictedWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : null
            } 
          />

          <View style={[styles.card, { marginTop: 8 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Key Metrics</Text>
            <MetricCard 
              icon="people" 
              label="Density" 
              value={live?.cameras?.[activeAlert.corridorId]?.density?.toFixed(1) || activeAlert.triggerSnapshot?.density?.toFixed(1) || '--'} 
              trend={1}
              status={(live?.cameras?.[activeAlert.corridorId]?.density || activeAlert.triggerSnapshot?.density) > 3.5 ? 'danger' : 'warning'}
            />
            <MetricCard 
              icon="trending-up" 
              label="Pressure Score" 
              value={Math.round(live?.cameras?.[activeAlert.corridorId]?.pressure_score || activeAlert.triggerSnapshot?.pressure_score) || '--'} 
              trend={1}
              status={(live?.cameras?.[activeAlert.corridorId]?.pressure_score || activeAlert.triggerSnapshot?.pressure_score) > 55 ? 'danger' : 'warning'}
            />
            <MetricCard 
              icon="speedometer" 
              label="CPI" 
              value={live?.cameras?.[activeAlert.corridorId]?.cpi?.toFixed(1) || activeAlert.triggerSnapshot?.cpi?.toFixed(1) || '--'} 
              trend={-1}
              status="warning"
            />
            <MetricCard 
              icon="exit" 
              label="Exit Routes" 
              value="4 open" 
              trend={0}
              status="safe"
            />
          </View>

          <Pressable
            onPress={() => setReasonsExpanded(!reasonsExpanded)}
            style={[styles.card, { marginTop: 8 }]}
          >
            <View style={styles.rowBetween}>
              <Text style={{ color: palette.text, fontWeight: '800' }}>Trigger Reasons</Text>
              <Ionicons name={reasonsExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={palette.textMuted} />
            </View>
            {!reasonsExpanded && (
              <Text style={{ color: palette.textMuted, marginTop: 4 }}>Tap to expand</Text>
            )}
            {reasonsExpanded && (
              <View style={{ marginTop: 12, gap: 8 }}>
                <ReasonItem reason="Density above safe limit (3.5 persons/m²)" expanded />
                <ReasonItem reason="Entry flow exceeds exit capacity" expanded />
                <ReasonItem reason="Walking speed dropping below threshold" expanded />
              </View>
            )}
          </Pressable>

          {role === 'ADMIN' ? (
            <View style={{ marginTop: 12 }}>
              {activeAlert._authoritiesNotifiedAt ? (
                <View style={[styles.card, { backgroundColor: palette.surfaceMuted, alignItems: 'center' }]}>
                  <Ionicons name="checkmark-done-circle" size={32} color={palette.safe} />
                  <Text style={{ color: palette.text, fontWeight: '900', marginTop: 8 }}>Authorities Notified</Text>
                  <Text style={{ color: palette.textMuted, marginTop: 4, fontWeight: '800' }}>
                    {[activeAlert.acks?.TEMPLE_AGENCY?.ackedAt, activeAlert.acks?.POLICE?.ackedAt, activeAlert.acks?.TRANSPORT?.ackedAt].filter(Boolean).length} / 3 Authorities Acknowledged
                  </Text>
                </View>
              ) : (
                <Pressable
                  onPress={async () => {
                    if (buttonPressed) return;
                    setButtonPressed(true);
                    try {
                      await notifyAuthorities(activeAlert.id);
                    } finally {
                      setButtonPressed(false);
                    }
                  }}
                  style={[styles.primaryButtonNew, { marginTop: 8, backgroundColor: palette.primary }]}
                >
                  <Ionicons name="notifications" size={20} color="#FFFFFF" style={styles.primaryButtonIcon} />
                  <Text style={[styles.primaryButtonLabel, { color: '#FFFFFF' }]}>NOTIFY AUTHORITIES</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable
              onPress={handleAcknowledge}
              disabled={dispatched}
              style={[
                styles.primaryButtonNew,
                buttonPressed && styles.primaryButtonPressed,
                dispatched ? styles.primaryButtonCompleted : null,
                { marginTop: 8, backgroundColor: dispatched ? palette.safe : palette.primary }
              ]}
            >
              <Ionicons 
                name={dispatched ? 'checkmark-circle' : 'shield-checkmark'} 
                size={20} 
                color="#FFFFFF" 
                style={styles.primaryButtonIcon} 
              />
              <Text style={[styles.primaryButtonLabel, { color: '#FFFFFF' }]}>
                {dispatched ? 'ACKNOWLEDGED' : `ACKNOWLEDGE AS ${ROLE_LABELS[role]?.toUpperCase()}`}
              </Text>
            </Pressable>
          )}
        </>
      ) : null}

      {tab === 'resolved' && list.length > 0 && (
        <>
          <Text style={{ color: palette.textMuted, fontWeight: '800', marginTop: 8, marginBottom: 8 }}>{title}</Text>
          {list.map(alert => {
            const lvl = severityLevel(alert.severity);
            return (
              <View key={alert.id} style={[styles.card, { borderLeftWidth: 5, borderLeftColor: colorForStatus(lvl) }]}>
                <View style={styles.rowBetween}>
                  <Text style={{ color: colorForStatus(lvl), fontWeight: '900' }}>{alert.severity}</Text>
                  <Text style={{ color: palette.textSubtle }}>{new Date(alert.createdAt).toLocaleTimeString()}</Text>
                </View>
                <Text style={{ color: palette.text, fontWeight: '900', marginTop: 10 }}>
                  {alert.triggerSnapshot?.cctv_camera_location || alert.corridorId}
                </Text>
                <Text style={{ color: palette.textMuted, marginTop: 4 }}>
                  Resolved at {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleTimeString() : 'N/A'}
                </Text>
              </View>
            );
          })}
        </>
      )}

      {!list.length && live && (
        <View style={[styles.card, { marginTop: 8 }]}>
          <Text style={{ color: palette.textMuted, textAlign: 'center' }}>No alerts</Text>
        </View>
      )}
    </ScrollView>
  );
}