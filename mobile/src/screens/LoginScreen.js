import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme';
import { useTranslation } from 'react-i18next';

export function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('login')}</Text>
        
        {error && <Text style={styles.error}>{error}</Text>}

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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('login')}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 15 }}>
          <Text style={styles.linkText}>Don't have an account? {t('signup')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: palette.surface,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
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
  input: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.border,
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
  error: {
    color: palette.danger,
    marginBottom: 16,
    textAlign: 'center',
  }
});
