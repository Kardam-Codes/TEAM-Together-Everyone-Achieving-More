import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme';
import { ROLES, ROLE_LABELS } from '../constants/roles';
import { useTranslation } from 'react-i18next';

export function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.TEMPLE_AGENCY);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signup(username, password, role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('signup')}</Text>
          
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error || ''}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={t('username')}
            placeholderTextColor={palette.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder={t('password')}
            placeholderTextColor={palette.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>{t('role')}</Text>
          <View style={styles.roleContainer}>
            {Object.values(ROLES).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleButton, role === r && styles.roleButtonActive]}
                onPress={() => setRole(r)}
              >
                <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                  {ROLE_LABELS[r]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('signup')}</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 15 }}>
            <Text style={styles.linkText}>Already have an account? {t('login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: palette.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceDark,
  },
  roleButtonActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  roleText: {
    color: palette.textMuted,
    fontWeight: '600',
  },
  roleTextActive: {
    color: palette.primary,
  },
  button: {
    backgroundColor: palette.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  linkText: {
    color: palette.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorContainer: {
    minHeight: 20,
    marginBottom: 16,
    justifyContent: 'center',
  },
  error: {
    color: palette.danger,
    textAlign: 'center',
  }
});
