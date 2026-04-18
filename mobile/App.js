// OWNER - HEET
// PURPOSE - Root composition layer for the mobile crowd alert app.

import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import { incident } from './src/data/incidentData';
import { BottomNavigation } from './src/components/common';
import { ActionsScreen, AlertScreen, Header, MetricsScreen } from './src/components/screens';
import { styles } from './src/styles/appStyles';
import { palette } from './src/theme';

export default function App() {
  const [activeTab, setActiveTab] = useState('alert');

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={palette.surfaceDark} />
      <Header data={incident} />

      <View style={styles.content}>
        {activeTab === 'alert' ? <AlertScreen data={incident} onActions={() => setActiveTab('actions')} /> : null}
        {activeTab === 'actions' ? <ActionsScreen data={incident} /> : null}
        {activeTab === 'metrics' ? <MetricsScreen data={incident} /> : null}
      </View>

      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}
