// OWNER - HEET
// PURPOSE - App navigation: role login stack + 5-tab main app.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border, height: 65, paddingBottom: 8, paddingTop: 8 },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'warning' : 'warning-outline';
          else if (route.name === 'Actions') iconName = focused ? 'construct' : 'construct-outline';
          else if (route.name === 'Analytics') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'Log') iconName = focused ? 'document-text' : 'document-text-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => (
          <React.Fragment />
        ),
      })}
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

