// OWNER - HEET
// PURPOSE - App navigation: role login stack + 5-tab main app.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { RoleSelectScreen } from '../screens/RoleSelectScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { ActionsScreen } from '../screens/ActionsScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { LogScreen } from '../screens/LogScreen';
import { palette } from '../theme';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
      }}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Alerts" component={AlertsScreen} />
      <Tabs.Screen name="Actions" component={ActionsScreen} />
      <Tabs.Screen name="Analytics" component={AnalyticsScreen} />
      <Tabs.Screen name="Log" component={LogScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const { role, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

