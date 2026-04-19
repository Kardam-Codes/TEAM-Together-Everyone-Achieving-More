// OWNER - HEET
// PURPOSE - Central polling state for live CCTV, alerts, temples, and replay controls.

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  fetchAlerts,
  fetchLiveState,
  fetchLogs,
  fetchTemples,
  postAck,
  postAction,
  setReplayControl,
} from '../api/liveClient';
import { getStoredTableName, getStoredTempleId, setStoredTableName, setStoredTempleId } from '../services/storage';

const LiveContext = createContext(null);

function pickDefaultTempleId(temples) {
  const somnath = temples?.find(t => t.id === 'somnath');
  return somnath?.id || temples?.[0]?.id || 'somnath';
}

export function LiveProvider({ children }) {
  const [temples, setTemples] = useState([]);
  const [templeId, setTempleId] = useState('somnath');
  const [tableName, setTableName] = useState(null);

  const [live, setLive] = useState(null);
  const [alertsActive, setAlertsActive] = useState([]);
  const [alertsResolved, setAlertsResolved] = useState([]);
  const [logs, setLogs] = useState([]);

  const [replay, setReplay] = useState({ mode: 'LIVE', paused: false, speed: 1 });

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let alive = true;

    (async () => {
      try {
        const [storedTempleId, storedTableName] = await Promise.all([getStoredTempleId(), getStoredTableName()]);
        if (!alive) return;
        if (storedTempleId) setTempleId(storedTempleId);
        if (storedTableName) setTableName(storedTableName);
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const t = await fetchTemples();
        if (!alive) return;
        setTemples(t.temples || []);
        if (!templeId) setTempleId(pickDefaultTempleId(t.temples || []));
      } catch (err) {
        // ignore; keep defaults
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setStoredTempleId(templeId);
  }, [templeId]);

  useEffect(() => {
    if (tableName) setStoredTableName(tableName);
  }, [tableName]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function tickLive() {
      try {
        const data = await fetchLiveState({ signal: controller.signal });
        if (!alive) return;
        setLive(data);
        if (!tableName) {
          const firstKey = Object.keys(data?.cameras || {})[0];
          if (firstKey) setTableName(firstKey);
        }
      } catch (err) {
        // keep last good
      }
    }

    tickLive();
    const interval = setInterval(tickLive, 1000);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [tableName]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function tickAlerts() {
      try {
        const [active, resolved] = await Promise.all([
          fetchAlerts({ status: 'active', templeId, signal: controller.signal }),
          fetchAlerts({ status: 'resolved', templeId, signal: controller.signal }),
        ]);
        if (!alive) return;
        setAlertsActive(active.alerts || []);
        setAlertsResolved(resolved.alerts || []);
      } catch (err) {
        // ignore
      }
    }

    tickAlerts();
    const interval = setInterval(tickAlerts, 2500);
    return () => {
      alive = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [templeId]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetchLogs({ signal: controller.signal });
        if (!alive) return;
        setLogs(response.logs || []);
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [alertsResolved.length]);

  const selectedCamera = live?.cameras?.[tableName] || null;

  const globalSeverity = useMemo(() => {
    const cameras = live?.cameras || {};
    const severities = Object.values(cameras).map(c => c?.severity).filter(Boolean);
    if (severities.includes('DANGER')) return 'DANGER';
    if (severities.includes('WARNING')) return 'WARNING';
    if (severities.includes('WATCH')) return 'WATCH';
    return 'SAFE';
  }, [live]);

  const mostSevereAlert = useMemo(() => {
    const active = alertsActive || [];
    const order = { DANGER: 3, WARNING: 2, WATCH: 1, SAFE: 0 };
    return active.slice().sort((a, b) => (order[b.severity] || 0) - (order[a.severity] || 0))[0] || null;
  }, [alertsActive]);

  const value = useMemo(
    () => ({
      temples,
      templeId,
      setTempleId,
      tableName,
      setTableName,
      live,
      selectedCamera,
      globalSeverity,
      alertsActive,
      alertsResolved,
      logs,
      replay,
      mostSevereAlert,
      async acknowledge(alertId, role) {
        return postAck({ alertId, role });
      },
      async notifyAuthorities(alertId) {
        const { notifyAuthorities: apiNotify } = require('../api/liveClient');
        return apiNotify({ alertId });
      },
      async updateAction(alertId, payload) {
        return postAction({ alertId, ...payload });
      },
      async setReplay(next) {
        setReplay(prev => ({ ...prev, ...next }));
        return setReplayControl(next);
      },
    }),
    [
      temples,
      templeId,
      tableName,
      live,
      selectedCamera,
      globalSeverity,
      alertsActive,
      alertsResolved,
      logs,
      replay,
      mostSevereAlert,
    ]
  );

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export function useLive() {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error('useLive must be used within LiveProvider');
  return ctx;
}

