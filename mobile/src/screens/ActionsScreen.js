// OWNER - HEET
// PURPOSE - Actions screen: show current alert context + role panels to update action status.

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { ROLE_LABELS, ROLES } from '../constants/roles';
import { styles } from '../styles/appStyles';
import { palette } from '../theme';

function Panel({ title, expanded, onToggle, children, highlight }) {
  return (
    <View style={[styles.card, highlight ? { borderColor: palette.primary } : null]}>
      <Pressable onPress={onToggle} style={styles.rowBetween}>
        <Text style={{ color: palette.text, fontWeight: '900', fontSize: 16 }}>{title}</Text>
        <Text style={{ color: palette.textMuted, fontWeight: '800' }}>{expanded ? 'Hide' : 'Show'}</Text>
      </Pressable>
      {expanded ? <View style={{ marginTop: 12 }}>{children}</View> : null}
    </View>
  );
}

function ActionButtons({ onSet, primaryLabel, secondaryLabel, tertiaryLabel }) {
  return (
    <View style={{ gap: 10 }}>
      <Pressable onPress={() => onSet(primaryLabel)} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
      </Pressable>
      {secondaryLabel ? (
        <Pressable
          onPress={() => onSet(secondaryLabel)}
          style={[styles.secondaryButton, { marginTop: 0 }]}
        >
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
      {tertiaryLabel ? (
        <Pressable
          onPress={() => onSet(tertiaryLabel)}
          style={[styles.secondaryButton, { marginTop: 0 }]}
        >
          <Text style={styles.secondaryText}>{tertiaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ActionsScreen() {
  const { role } = useAuth();
  const { mostSevereAlert, updateAction } = useLive();

  const [expanded, setExpanded] = useState(null);

  const preferred = useMemo(() => role, [role]);
  const expandedKey = expanded || preferred;

  if (!mostSevereAlert) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <Text style={styles.sectionSubtitle}>No active alerts. Actions are idle.</Text>
        </View>
      </ScrollView>
    );
  }

  async function setStatus(forRole, status) {
    await updateAction(mostSevereAlert.id, { role: forRole, status });
  }

  const contextLabel = `${mostSevereAlert.severity} — ${mostSevereAlert.triggerSnapshot?.cctv_camera_location || mostSevereAlert.corridorId}`;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <Text style={styles.sectionSubtitle}>Responding to: {contextLabel}</Text>
      </View>

      <Panel
        title="Police"
        expanded={expandedKey === ROLES.POLICE}
        onToggle={() => setExpanded(expandedKey === ROLES.POLICE ? null : ROLES.POLICE)}
        highlight={role === ROLES.POLICE}
      >
        <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Recommended</Text>
        <Text style={{ color: palette.text, fontWeight: '900', marginTop: 6 }}>
          {mostSevereAlert.actions?.POLICE?.recommended}
        </Text>
        <Text style={{ color: palette.textMuted, marginTop: 8 }}>
          Status: <Text style={{ color: palette.text, fontWeight: '900' }}>{mostSevereAlert.actions?.POLICE?.status}</Text>
        </Text>
        {role === ROLES.POLICE ? (
          <View style={{ marginTop: 12 }}>
            <ActionButtons
              onSet={s => setStatus(ROLES.POLICE, s)}
              primaryLabel="DISPATCHED"
              secondaryLabel="EN_ROUTE"
              tertiaryLabel="ON_SITE"
            />
          </View>
        ) : null}
      </Panel>

      <Panel
        title="Temple Trust"
        expanded={expandedKey === ROLES.TEMPLE_STAFF}
        onToggle={() => setExpanded(expandedKey === ROLES.TEMPLE_STAFF ? null : ROLES.TEMPLE_STAFF)}
        highlight={role === ROLES.TEMPLE_STAFF}
      >
        <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Recommended</Text>
        <Text style={{ color: palette.text, fontWeight: '900', marginTop: 6 }}>
          {mostSevereAlert.actions?.TEMPLE_STAFF?.recommended}
        </Text>
        <Text style={{ color: palette.textMuted, marginTop: 8 }}>
          Status: <Text style={{ color: palette.text, fontWeight: '900' }}>{mostSevereAlert.actions?.TEMPLE_STAFF?.status}</Text>
        </Text>
        {role === ROLES.TEMPLE_STAFF ? (
          <View style={{ marginTop: 12 }}>
            <ActionButtons onSet={s => setStatus(ROLES.TEMPLE_STAFF, s)} primaryLabel="HOLD_ACTIVE" secondaryLabel="REDIRECT" tertiaryLabel="RESUME" />
          </View>
        ) : null}
      </Panel>

      <Panel
        title="Transport"
        expanded={expandedKey === ROLES.TRANSPORT}
        onToggle={() => setExpanded(expandedKey === ROLES.TRANSPORT ? null : ROLES.TRANSPORT)}
        highlight={role === ROLES.TRANSPORT}
      >
        <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Recommended</Text>
        <Text style={{ color: palette.text, fontWeight: '900', marginTop: 6 }}>
          {mostSevereAlert.actions?.TRANSPORT?.recommended}
        </Text>
        <Text style={{ color: palette.textMuted, marginTop: 8 }}>
          Status: <Text style={{ color: palette.text, fontWeight: '900' }}>{mostSevereAlert.actions?.TRANSPORT?.status}</Text>
        </Text>
        {role === ROLES.TRANSPORT ? (
          <View style={{ marginTop: 12 }}>
            <ActionButtons onSet={s => setStatus(ROLES.TRANSPORT, s)} primaryLabel="HOLD_ISSUED" secondaryLabel="DIVERTED" tertiaryLabel="CLEARED" />
          </View>
        ) : null}
      </Panel>
    </ScrollView>
  );
}

