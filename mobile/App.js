// OWNER - HEET
// PURPOSE - Root composition layer for the mobile crowd alert app (wired to backend /api/live).

import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import { incident as fallbackIncident } from './src/data/incidentData';
import { BottomNavigation } from './src/components/common';
import { ActionsScreen, AlertScreen, Header, MetricsScreen } from './src/components/screens';
import { styles } from './src/styles/appStyles';
import { palette } from './src/theme';
import { fetchLiveState } from './src/api/liveClient';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function riskToUi(risk) {
  if (risk === 'HIGH') return { status: 'Danger', level: 'danger' };
  if (risk === 'MEDIUM') return { status: 'Warning', level: 'warning' };
  return { status: 'Safe', level: 'safe' };
}

function formatCrushIn(crushIn) {
  if (typeof crushIn !== 'number') return '--:--';
  return `${pad2(crushIn)}:00`;
}

function computeReasons(state) {
  const reasons = [];
  if (!state) return reasons;
  if (typeof state.density === 'number' && state.density >= 3.5) reasons.push('Density is above safe limit.');
  if (state.status === 'CRUSH_BUILDUP') reasons.push('Density is continuously rising.');
  if (state.status === 'SURGE') reasons.push('Sudden spike detected.');
  if (state.risk === 'HIGH') reasons.push('Risk trend is high.');
  return reasons.length ? reasons : ['Monitoring live conditions.'];
}

function buildZonesFromLive(live) {
  const cameras = live?.cameras && typeof live.cameras === 'object' ? live.cameras : {};
  return Object.entries(cameras)
    .slice(0, 6)
    .map(([tableName, state]) => ({
      label: tableName,
      area: state?.cctv_camera_location || tableName,
      status: state?.risk === 'HIGH' ? 'danger' : state?.risk === 'MEDIUM' ? 'warning' : 'safe',
      density: typeof state?.density === 'number' ? state.density : 0,
    }));
}

function buildIncidentFromLive(live, selectedTable) {
  const cameras = live?.cameras && typeof live.cameras === 'object' ? live.cameras : {};
  const firstKey = Object.keys(cameras)[0];
  const tableName = selectedTable || firstKey || 'main_entry_gate';
  const state = cameras[tableName] || null;

  const ui = riskToUi(state?.risk);
  const corridor = state?.cctv_camera_location || tableName;

  return {
    ...fallbackIncident,
    status: ui.status,
    statusLevel: ui.level,
    corridor,
    sector: tableName,
    title:
      state?.status === 'CRUSH_BUILDUP'
        ? 'Crush buildup detected'
        : state?.status === 'SURGE'
          ? 'Surge detected'
          : 'Live monitoring',
    predictedRiskIn: formatCrushIn(state?.crush_in),
    density: typeof state?.density === 'number' ? state.density : fallbackIncident.density,
    safeDensity: fallbackIncident.safeDensity,
    flowImbalance: typeof state?.cpi === 'number' ? `CPI ${state.cpi}` : fallbackIncident.flowImbalance,
    exitRoutes: fallbackIncident.exitRoutes,
    updatedAt: state?.timestamp ? `${state.timestamp} live` : 'live',
    reasons: computeReasons(state),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState('alert');
  const [live, setLive] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function tick() {
      try {
        const data = await fetchLiveState({ signal: controller.signal });
        if (!alive) return;
        setLive(data);
      } catch (err) {
        // keep last good state; silent retry
      }
    }

    tick();
    const interval = setInterval(tick, 1000);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const incident = useMemo(() => buildIncidentFromLive(live, selectedTable), [live, selectedTable]);
  const zones = useMemo(() => buildZonesFromLive(live), [live]);

  useEffect(() => {
    if (!live?.cameras) return;
    const cameras = live.cameras;
    const key = selectedTable || Object.keys(cameras)[0];
    const density = cameras?.[key]?.density;
    if (typeof density !== 'number') return;

    setTrend(prev => {
      const next = [...prev, density];
      return next.slice(-8);
    });
  }, [live, selectedTable]);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={palette.surfaceDark} />
      <Header data={incident} />

      <View style={styles.content}>
        {activeTab === 'alert' ? (
          <AlertScreen
            data={incident}
            zones={zones}
            onActions={() => setActiveTab('actions')}
            onSelectZone={setSelectedTable}
          />
        ) : null}
        {activeTab === 'actions' ? <ActionsScreen data={incident} /> : null}
        {activeTab === 'metrics' ? <MetricsScreen data={incident} trend={trend.length ? trend : undefined} /> : null}
      </View>

      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}
