// OWNER - HEET
// PURPOSE - Simple login screen to select the user role (Temple Staff / Police / Transport).

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS, ROLES } from '../constants/roles';
import { styles } from '../styles/appStyles';
import { palette } from '../theme';

function RoleButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: palette.primary, backgroundColor: palette.surface, padding: 16 },
      ]}
    >
      <Text style={{ color: palette.text, fontSize: 18, fontWeight: '800' }}>{label}</Text>
      <Text style={{ color: palette.textMuted, marginTop: 6 }}>
        Continue as {label}.
      </Text>
    </Pressable>
  );
}

export function RoleSelectScreen() {
  const { login } = useAuth();

  return (
    <View style={[styles.app, { padding: 16, gap: 12, justifyContent: 'center' }]}>
      <Text style={{ color: palette.text, fontSize: 26, fontWeight: '900' }}>Stampede Prediction</Text>
      <Text style={{ color: palette.textMuted, marginBottom: 8 }}>
        Select your role to prioritize actions and acknowledgements.
      </Text>

      <RoleButton label={ROLE_LABELS[ROLES.TEMPLE_STAFF]} onPress={() => login(ROLES.TEMPLE_STAFF)} />
      <RoleButton label={ROLE_LABELS[ROLES.POLICE]} onPress={() => login(ROLES.POLICE)} />
      <RoleButton label={ROLE_LABELS[ROLES.TRANSPORT]} onPress={() => login(ROLES.TRANSPORT)} />
    </View>
  );
}

