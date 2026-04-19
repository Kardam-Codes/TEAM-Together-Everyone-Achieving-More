// OWNER - HEET
// PURPOSE - Actions screen: show current alert context + role panels to update action status.

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, ActivityIndicator, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { ROLES } from '../constants/roles';
import { styles } from '../styles/appStyles';
import { palette, colorForStatus, softColorForStatus } from '../theme';

function Panel({ title, expanded, onToggle, children, highlight, icon }) {
  return (
    <View style={[styles.card, highlight ? { borderColor: palette.primary, borderWidth: 2 } : null]}>
      <Pressable onPress={onToggle} style={styles.rowBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name={icon || 'help-circle'} size={22} color={highlight ? palette.primary : palette.textMuted} />
          <Text style={{ color: palette.text, fontWeight: '900', fontSize: 16 }}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>{expanded ? 'Hide' : 'Show'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={palette.textMuted} />
        </View>
      </Pressable>
      {expanded ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </View>
  );
}

function ActionButtons({ onSet, primaryLabel, secondaryLabel, tertiaryLabel, currentStatus }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const completed =
    currentStatus === primaryLabel   ? 'primary'   :
    currentStatus === secondaryLabel ? 'secondary' :
    currentStatus === tertiaryLabel  ? 'tertiary'  : null;

  async function handlePress(slot, label) {
    if (loading) return;
    setLoading(slot);
    setError(null);
    try {
      await onSet(label);
    } catch (e) {
      setError(e?.message || 'Update failed. Try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={() => handlePress('primary', primaryLabel)}
        disabled={completed === 'primary' || loading === 'primary'}
        style={[
          styles.primaryButton,
          { backgroundColor: completed === 'primary' ? palette.safe : palette.primary }
        ]}
      >
        {loading === 'primary' ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons
            name={completed === 'primary' ? 'checkmark-circle' : 'shield'}
            size={20}
            color="#FFFFFF"
          />
        )}
        <Text style={[styles.primaryButtonLabel, { color: '#FFFFFF' }]}>
          {loading === 'primary' ? 'UPDATING...' : primaryLabel}
        </Text>
      </Pressable>
      {secondaryLabel ? (
        <Pressable
          onPress={() => handlePress('secondary', secondaryLabel)}
          disabled={completed === 'secondary' || loading === 'secondary'}
          style={[
            styles.secondaryButton,
            { borderColor: palette.border, borderWidth: 1 }
          ]}
        >
          {loading === 'secondary' ? (
            <ActivityIndicator size="small" color={palette.text} />
          ) : (
            <Ionicons
              name={completed === 'secondary' ? 'checkmark-circle' : 'bus'}
              size={16}
              color={completed === 'secondary' ? palette.safe : palette.text}
            />
          )}
          <Text style={[styles.primaryButtonLabel, { color: completed === 'secondary' ? palette.safe : palette.text, fontSize: 14 }]}>
            {loading === 'secondary' ? 'UPDATING...' : secondaryLabel}
          </Text>
        </Pressable>
      ) : null}
      {tertiaryLabel ? (
        <Pressable
          onPress={() => handlePress('tertiary', tertiaryLabel)}
          disabled={completed === 'tertiary' || loading === 'tertiary'}
          style={[
            styles.secondaryButton,
            { borderColor: palette.border, borderWidth: 1 }
          ]}
        >
          {loading === 'tertiary' ? (
            <ActivityIndicator size="small" color={palette.text} />
          ) : (
            <Ionicons
              name={completed === 'tertiary' ? 'checkmark-circle' : 'pin'}
              size={16}
              color={completed === 'tertiary' ? palette.safe : palette.text}
            />
          )}
          <Text style={[styles.primaryButtonLabel, { color: completed === 'tertiary' ? palette.safe : palette.text, fontSize: 14 }]}>
            {loading === 'tertiary' ? 'UPDATING...' : tertiaryLabel}
          </Text>
        </Pressable>
      ) : null}
      {error ? <Text style={{ color: palette.danger, fontSize: 12, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}


const STATUS_COLORS = { 
  DISPATCHED: palette.safeSoft, 
  EN_ROUTE: palette.warningSoft, 
  ON_SITE: palette.safeSoft, 
  HOLD_ACTIVE: palette.warningSoft,
  REDIRECT: palette.warningSoft,
  RESUME: palette.safeSoft,
  HOLD_ISSUED: palette.warningSoft,
  DIVERTED: palette.warningSoft,
  CLEARED: palette.safeSoft,
  PENDING: palette.surfaceMuted
};

const STATUS_TEXT_COLORS = {
  DISPATCHED: palette.safe,
  EN_ROUTE: palette.warning,
  ON_SITE: palette.safe,
  HOLD_ACTIVE: palette.warning,
  REDIRECT: palette.warning,
  RESUME: palette.safe,
  HOLD_ISSUED: palette.warning,
  DIVERTED: palette.warning,
  CLEARED: palette.safe,
  PENDING: palette.text
};

export function ActionsScreen() {
  const { role } = useAuth();
  const { mostSevereAlert, updateAction } = useLive();

  const [expanded, setExpanded] = useState(() => new Set([role]));

  const toggleExpanded = (panelRole) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(panelRole)) {
        next.delete(panelRole);
      } else {
        next.add(panelRole);
      }
      return next;
    });
  };

  if (!mostSevereAlert) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
          <Ionicons name="checkmark-circle-outline" size={48} color={palette.safe} />
          <Text style={[styles.sectionTitle, { marginTop: 16, textAlign: 'center' }]}>Actions</Text>
          <Text style={[styles.sectionSubtitle, { textAlign: 'center' }]}>No active alerts. All clear.</Text>
        </View>
      </ScrollView>
    );
  }

  async function setStatus(forRole, status) {
    try {
      await updateAction(mostSevereAlert.id, { role: forRole, status });
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to update action');
      throw err;
    }
  }

  const contextLabel = `${mostSevereAlert.severity} — ${mostSevereAlert.triggerSnapshot?.cctv_camera_location || mostSevereAlert.corridorId}`;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: palette.danger }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="warning" size={24} color={palette.danger} />
          <Text style={[styles.sectionTitle, { color: palette.danger }]}>Responding to Alert</Text>
        </View>
        <Text style={{ color: palette.textMuted, marginTop: 8 }}>{contextLabel}</Text>
      </View>

      <Panel
        title="Police"
        icon="shield"
        expanded={expanded.has(ROLES.POLICE)}
        onToggle={() => toggleExpanded(ROLES.POLICE)}
        highlight={role === ROLES.POLICE}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Recommended:</Text>
          <Text style={{ color: palette.text, fontWeight: '900', flex: 1 }}>
            {mostSevereAlert.actions?.POLICE?.recommended || 'Dispatch unit to sector'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Status:</Text>
          <View style={{ 
            paddingHorizontal: 10, 
            paddingVertical: 4, 
            borderRadius: 4, 
            backgroundColor: STATUS_COLORS[mostSevereAlert.actions?.POLICE?.status || 'PENDING'] || palette.surfaceMuted 
          }}>
            <Text style={{ color: STATUS_TEXT_COLORS[mostSevereAlert.actions?.POLICE?.status || 'PENDING'] || palette.text, fontWeight: '900' }}>
              {mostSevereAlert.actions?.POLICE?.status || 'PENDING'}
            </Text>
          </View>
        </View>
        {role === ROLES.POLICE ? (
          <View style={{ marginTop: 14 }}>
            <ActionButtons
              onSet={s => setStatus(ROLES.POLICE, s)}
              primaryLabel="DISPATCHED"
              secondaryLabel="EN_ROUTE"
              tertiaryLabel="ON_SITE"
              currentStatus={mostSevereAlert.actions?.POLICE?.status}
            />
          </View>
        ) : null}
      </Panel>

      <Panel
        title="Temple Trust"
        icon="business"
        expanded={expanded.has(ROLES.TEMPLE_AGENCY)}
        onToggle={() => toggleExpanded(ROLES.TEMPLE_AGENCY)}
        highlight={role === ROLES.TEMPLE_AGENCY}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Recommended:</Text>
          <Text style={{ color: palette.text, fontWeight: '900', flex: 1 }}>
            {mostSevereAlert.actions?.TEMPLE_AGENCY?.recommended || 'Pause entry'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Status:</Text>
          <View style={{ 
            paddingHorizontal: 10, 
            paddingVertical: 4, 
            borderRadius: 4, 
            backgroundColor: STATUS_COLORS[mostSevereAlert.actions?.TEMPLE_AGENCY?.status || 'PENDING'] || palette.surfaceMuted 
          }}>
            <Text style={{ color: STATUS_TEXT_COLORS[mostSevereAlert.actions?.TEMPLE_AGENCY?.status || 'PENDING'] || palette.text, fontWeight: '900' }}>
              {mostSevereAlert.actions?.TEMPLE_AGENCY?.status || 'PENDING'}
            </Text>
          </View>
        </View>
        {role === ROLES.TEMPLE_AGENCY ? (
          <View style={{ marginTop: 14 }}>
            <ActionButtons 
              onSet={s => setStatus(ROLES.TEMPLE_AGENCY, s)} 
              primaryLabel="HOLD_ACTIVE" 
              secondaryLabel="REDIRECT" 
              tertiaryLabel="RESUME" 
              currentStatus={mostSevereAlert.actions?.TEMPLE_AGENCY?.status}
            />
          </View>
        ) : null}
      </Panel>

      <Panel
        title="Transport"
        icon="bus"
        expanded={expanded.has(ROLES.TRANSPORT)}
        onToggle={() => toggleExpanded(ROLES.TRANSPORT)}
        highlight={role === ROLES.TRANSPORT}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Recommended:</Text>
          <Text style={{ color: palette.text, fontWeight: '900', flex: 1 }}>
            {mostSevereAlert.actions?.TRANSPORT?.recommended || 'Hold shuttles'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <Text style={{ color: palette.textMuted, fontWeight: '800' }}>Status:</Text>
          <View style={{ 
            paddingHorizontal: 10, 
            paddingVertical: 4, 
            borderRadius: 4, 
            backgroundColor: STATUS_COLORS[mostSevereAlert.actions?.TRANSPORT?.status || 'PENDING'] || palette.surfaceMuted 
          }}>
            <Text style={{ color: STATUS_TEXT_COLORS[mostSevereAlert.actions?.TRANSPORT?.status || 'PENDING'] || palette.text, fontWeight: '900' }}>
              {mostSevereAlert.actions?.TRANSPORT?.status || 'PENDING'}
            </Text>
          </View>
        </View>
        {role === ROLES.TRANSPORT ? (
          <View style={{ marginTop: 14 }}>
            <ActionButtons 
              onSet={s => setStatus(ROLES.TRANSPORT, s)} 
              primaryLabel="HOLD_ISSUED" 
              secondaryLabel="DIVERTED" 
              tertiaryLabel="CLEARED" 
              currentStatus={mostSevereAlert.actions?.TRANSPORT?.status}
            />
          </View>
        ) : null}
      </Panel>
    </ScrollView>
  );
}