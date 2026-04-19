// OWNER - HEET
// PURPOSE - App root: providers + navigation for role login and 5-tab experience.

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import * as Notifications from 'expo-notifications';

import { palette } from './src/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LiveProvider } from './src/context/LiveContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerDevice } from './src/api/liveClient';
import './src/i18n'; // Initialize i18n

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function NotificationsBootstrap() {
  const { role } = useAuth();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!role) return;
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;
        const token = await Notifications.getExpoPushTokenAsync();
        if (!alive) return;
        if (token?.data) await registerDevice({ role, expoPushToken: token.data });
      } catch (err) {
        // best-effort only
      }
    })();
    return () => {
      alive = false;
    };
  }, [role]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <LiveProvider>
        <StatusBar barStyle="light-content" backgroundColor={palette.surfaceDark} />
        <NotificationsBootstrap />
        <AppNavigator />
      </LiveProvider>
    </AuthProvider>
  );
}
