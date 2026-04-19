// OWNER - HEET
// PURPOSE - Actions screen: show current alert context + role panels to update action status.

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { ROLE_LABELS, ROLES } from '../constants/roles';
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

function ActionButtons({ onSet, primaryLabel, secondaryLabel, tertiaryLabel }) {
  const [pressedState, setPressedState] = useState(null);
  const [completed, setCompleted] = useState(null);

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={() => { setCompleted('primary'); onSet(primaryLabel); }}
        disabled={completed === 'primary'}
        style={[
          styles.primaryButtonNew,
          { backgroundColor: completed === 'primary' ? palette.safe : palette.primary }
        ]}
      >
        <Ionicons
          name={completed === 'primary' ? 'checkmark-circle' : 'shield-checkmark'}
          size={20}
          color="#FFFFFF"
        />
        <Text style={[styles.primaryButtonLabel, { color: '#FFFFFF' }]}>{primaryLabel}</Text>
      </Pressable>
      {secondaryLabel ? (
        <Pressable
          onPress={() => { setCompleted('secondary'); onSet(secondaryLabel); }}
          disabled={completed === 'secondary'}
          style={[
            styles.secondaryButtonNew,
            { borderColor: palette.border, borderWidth: 1 }
          ]}
        >
          <Ionicons
            name={completed === 'secondary' ? 'checkmark-circle' : 'car'}
            size={16}
            color={completed === 'secondary' ? palette.safe : palette.text}
          />
          <Text style={[styles.primaryButtonLabel, { color: completed === 'secondary' ? palette.safe : palette.text, fontSize: 14 }]}>
            {secondaryLabel}
          </Text>
        </Pressable>
      ) : null}
      {tertiaryLabel ? (
        <Pressable
          onPress={() => { setCompleted('tertiary'); onSet(tertiaryLabel); }}
          disabled={completed === 'tertiary'}
          style={[
            styles.secondaryButtonNew,
            { borderColor: palette.border, borderWidth: 1 }
          ]
        }
        >
          <Ionicons
            name={completed === 'tertiary' ? 'checkmark-circle' : 'location'}
            size={16}
            color={completed === 'tertiary' ? palette.safe : palette.text}
          />
          <Text style={[styles.primaryButtonLabel, { color: completed === 'tertiary' ? palette.safe : palette.text, fontSize: 14 }]}>
            {tertiaryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ActionCard({ action, isPrimary, onAction }) {
  const [completed, setCompleted] = useState(false);

  const icons = {
    POLICE: 'shield',
    TEMPLE_AGENCY: 'business',
    TRANSPORT: 'bus',
  };

  return (
    <View style={[styles.actionCardNew, isPrimary ? styles.actionCardPrimary : null]}>
      <View style={styles.actionCardHeader}>
        <Ionicons name={icons[action.owner] || 'ellipse'} size={20} color={isPrimary ? palette.primary : palette.textMuted} style={styles.actionCardIcon} />
        <Text style={styles.actionCardTitle}>{action.title}</Text>
        {isPrimary && (
          <View style={[styles.actionCardTag, { backgroundColor: palette.primarySoft, color: palette.primary }]}>
            <Text style={[styles.actionCardTag, { backgroundColor: palette.primarySoft, color: palette.primary }]}>PRIMARY</Text>
          </View>
        )}
      </View>
      <Text style={styles.actionCardMeta}>Target: {action.target}</Text>
      <Text style={[styles.actionCardDesc, { color: palette.textMuted }]}>{action.note}</Text>
      <Pressable
        onPress={() => { setCompleted(true); onAction(action.id); }}
        disabled={completed}
        style={[
          styles.primaryButtonNew,
          { marginTop: 12, backgroundColor: completed ? palette.safe : palette.primary }
        ]}
      >
        <Ionicons name={completed ? 'checkmark-circle' : 'flash'} size={18} color="#FFFFFF" />
        <Text style={[styles.primaryButtonLabel, { color: '#FFFFFF', fontSize: 14 }]}>
          {completed ? 'COMPLETED' : 'EXECUTE'}
        </Text>
      </Pressable>
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
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
          <Ionicons name="checkmark-circle-outline" size={48} color={palette.safe} />
          <Text style={[styles.sectionTitle, { marginTop: 16, textAlign: 'center' }]}>Actions</Text>
          <Text style={[styles.sectionSubtitle, { textAlign: 'center' }]}>No active alerts. All clear.</Text>
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
        expanded={expandedKey === ROLES.POLICE}
        onToggle={() => setExpanded(expandedKey === ROLES.POLICE ? null : ROLES.POLICE)}
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
            backgroundColor: mostSevereAlert.actions?.POLICE?.status === 'DISPATCHED' ? palette.safeSoft : palette.surfaceMuted 
          }}>
            <Text style={{ color: mostSevereAlert.actions?.POLICE?.status === 'DISPATCHED' ? palette.safe : palette.text, fontWeight: '900' }}>
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
            />
          </View>
        ) : null}
      </Panel>

      <Panel
        title="Temple Trust"
        icon="business"
        expanded={expandedKey === ROLES.TEMPLE_AGENCY}
        onToggle={() => setExpanded(expandedKey === ROLES.TEMPLE_AGENCY ? null : ROLES.TEMPLE_AGENCY)}
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
            backgroundColor: mostSevereAlert.actions?.TEMPLE_AGENCY?.status === 'HOLD_ACTIVE' ? palette.warningSoft : palette.surfaceMuted 
          }}>
            <Text style={{ color: mostSevereAlert.actions?.TEMPLE_AGENCY?.status === 'HOLD_ACTIVE' ? palette.warning : palette.text, fontWeight: '900' }}>
              {mostSevereAlert.actions?.TEMPLE_AGENCY?.status || 'PENDING'}
            </Text>
          </View>
        </View>
        {role === ROLES.TEMPLE_AGENCY ? (
          <View style={{ marginTop: 14 }}>
            <ActionButtons onSet={s => setStatus(ROLES.TEMPLE_AGENCY, s)} primaryLabel="HOLD_ACTIVE" secondaryLabel="REDIRECT" tertiaryLabel="RESUME" />
          </View>
        ) : null}
      </Panel>

      <Panel
        title="Transport"
        icon="bus"
        expanded={expandedKey === ROLES.TRANSPORT}
        onToggle={() => setExpanded(expandedKey === ROLES.TRANSPORT ? null : ROLES.TRANSPORT)}
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
            backgroundColor: mostSevereAlert.actions?.TRANSPORT?.status === 'HOLD_ISSUED' ? palette.warningSoft : palette.surfaceMuted 
          }}>
            <Text style={{ color: mostSevereAlert.actions?.TRANSPORT?.status === 'HOLD_ISSUED' ? palette.warning : palette.text, fontWeight: '900' }}>
              {mostSevereAlert.actions?.TRANSPORT?.status || 'PENDING'}
            </Text>
          </View>
        </View>
        {role === ROLES.TRANSPORT ? (
          <View style={{ marginTop: 14 }}>
            <ActionButtons onSet={s => setStatus(ROLES.TRANSPORT, s)} primaryLabel="HOLD_ISSUED" secondaryLabel="DIVERTED" tertiaryLabel="CLEARED" />
          </View>
        ) : null}
      </Panel>
    </ScrollView>
  );
}