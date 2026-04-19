import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme';
import { useTranslation } from 'react-i18next';

export function SettingsScreen() {
  const { role, username, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const [cameraId, setCameraId] = useState('');
  const [area, setArea] = useState('');
  const [feedUrl, setFeedUrl] = useState('');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleAddCamera = async () => {
    if (!cameraId || !area) {
      Alert.alert('Error', 'Camera ID and Area are required.');
      return;
    }
    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.13:3000/api';
      const res = await fetch(`${API_BASE_URL}/cameras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cameraId, area, feedUrl, roles: ['ADMIN', 'TEMPLE_AGENCY', 'POLICE'] })
      });
      if (!res.ok) throw new Error('Failed to add camera');
      Alert.alert('Success', 'Camera added successfully!');
      setCameraId('');
      setArea('');
      setFeedUrl('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const isAdminOrAgency = role === 'ADMIN' || role === 'TEMPLE_AGENCY';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Account</Text>
        <Text style={styles.text}>{t('username')}: {username}</Text>
        <Text style={styles.text}>{t('role')}: {role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('language')}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={() => changeLanguage('en')}><Text style={styles.btnText}>English</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => changeLanguage('hi')}><Text style={styles.btnText}>हिंदी</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => changeLanguage('gu')}><Text style={styles.btnText}>ગુજરાતી</Text></TouchableOpacity>
        </View>
      </View>

      {isAdminOrAgency && (
        <View style={styles.section}>
          <Text style={styles.label}>{t('addCamera')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Camera ID (e.g. cam_001)"
            placeholderTextColor={palette.textMuted}
            value={cameraId}
            onChangeText={setCameraId}
          />
          <TextInput
            style={styles.input}
            placeholder="Area/Location (e.g. Main Gate)"
            placeholderTextColor={palette.textMuted}
            value={area}
            onChangeText={setArea}
          />
          <TextInput
            style={styles.input}
            placeholder="Feed URL (Optional)"
            placeholderTextColor={palette.textMuted}
            value={feedUrl}
            onChangeText={setFeedUrl}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleAddCamera}>
            <Text style={styles.primaryBtnText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.background,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 20,
  },
  section: {
    backgroundColor: palette.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textMuted,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: palette.text,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    backgroundColor: palette.surfaceDark,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  btnText: {
    color: palette.text,
  },
  input: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
  },
  primaryBtn: {
    backgroundColor: palette.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: palette.danger,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
