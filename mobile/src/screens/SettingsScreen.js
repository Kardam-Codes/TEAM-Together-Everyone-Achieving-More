import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme';
import { useTranslation } from 'react-i18next';
import { styles } from '../styles/appStyles';
import { getResolvedApiBaseUrl } from '../api/liveClient';

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
      const API_BASE_URL = getResolvedApiBaseUrl() + '/api';
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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.sectionTitle, { fontSize: 28, marginBottom: 8 }]}>{t('settings')}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={{ color: palette.text, marginTop: 10 }}>{t('username')}: {username}</Text>
        <Text style={{ color: palette.text, marginTop: 5 }}>{t('role')}: {role}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <TouchableOpacity style={[styles.secondaryButton, { paddingVertical: 8 }]} onPress={() => changeLanguage('en')}>
            <Text style={{ color: palette.text, fontWeight: '700' }}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { paddingVertical: 8 }]} onPress={() => changeLanguage('hi')}>
            <Text style={{ color: palette.text, fontWeight: '700' }}>हिंदी</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { paddingVertical: 8 }]} onPress={() => changeLanguage('gu')}>
            <Text style={{ color: palette.text, fontWeight: '700' }}>ગુજરાતી</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isAdminOrAgency && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('addCamera')}</Text>
          <View style={{ marginTop: 12, gap: 10 }}>
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
            <TouchableOpacity style={[styles.primaryButton, { marginTop: 4 }]} onPress={handleAddCamera}>
              <Text style={styles.primaryButtonLabel}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={[styles.primaryButton, { backgroundColor: palette.danger, marginTop: 16 }]} onPress={logout}>
        <Text style={styles.primaryButtonLabel}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
