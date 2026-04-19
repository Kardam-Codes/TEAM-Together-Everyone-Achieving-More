// OWNER - HEET
// PURPOSE - Simple login screen to select the user role (Temple Staff / Police / Transport).

import React from 'react';
import { Pressable, Text, View, Image, ScrollView } from 'react-native';

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
        { borderColor: palette.primary, backgroundColor: palette.surface, padding: 16, marginBottom: 12 },
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
    <ScrollView contentContainerStyle={[styles.app, { padding: 16, paddingVertical: 40, justifyContent: 'center' }]}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Image 
          source={require('../../../appLogo.jpeg')} 
          style={{ width: 120, height: 120, borderRadius: 24, marginBottom: 16 }}
          resizeMode="cover"
        />
        <Text style={{ color: palette.text, fontSize: 26, fontWeight: '900', textAlign: 'center' }}>Stampede Prediction</Text>
        <Text style={{ color: palette.textMuted, marginTop: 8, textAlign: 'center' }}>
          Select your role to prioritize actions and acknowledgements.
        </Text>
      </View>

      <RoleButton label={ROLE_LABELS[ROLES.TEMPLE_STAFF]} onPress={() => login(ROLES.TEMPLE_STAFF)} />
      <RoleButton label={ROLE_LABELS[ROLES.POLICE]} onPress={() => login(ROLES.POLICE)} />
      <RoleButton label={ROLE_LABELS[ROLES.TRANSPORT]} onPress={() => login(ROLES.TRANSPORT)} />
      <RoleButton label={ROLE_LABELS[ROLES.ADMIN]} onPress={() => login(ROLES.ADMIN)} />
    </ScrollView>
  );
}
