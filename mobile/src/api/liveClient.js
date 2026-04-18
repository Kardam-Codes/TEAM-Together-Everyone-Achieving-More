// OWNER - HEET
// PURPOSE - Fetch live multi-camera state from the backend and provide a simple polling helper.

import { NativeModules } from 'react-native';

const DEFAULT_BASE_URL = 'http://localhost:3000';

function getDevServerHost() {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (typeof scriptURL !== 'string' || !scriptURL.length) return null;

  // Typical values:
  // - http://192.168.1.41:8081/index.bundle?platform=android&dev=true
  // - http://192.168.1.41:19000/index.bundle?...
  // - exp://192.168.1.41:19000
  try {
    if (scriptURL.startsWith('http://') || scriptURL.startsWith('https://')) {
      return new URL(scriptURL).hostname;
    }
  } catch (err) {
    // fallthrough
  }

  const match = scriptURL.match(/^[a-zA-Z+.-]+:\/\/([^/:?#]+)/);
  return match?.[1] || null;
}

function resolveBaseUrl() {
  // For physical devices, set EXPO_PUBLIC_API_BASE_URL to something like:
  // http://192.168.x.x:3000
  if (process.env.EXPO_PUBLIC_API_BASE_URL) return process.env.EXPO_PUBLIC_API_BASE_URL;

  // If env var isn't set, try to infer the host from the Expo/RN dev server URL.
  const host = getDevServerHost();
  if (host) return `http://${host}:3000`;

  return DEFAULT_BASE_URL;
}

export async function fetchLiveState({ signal } = {}) {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/live`, { signal });
  if (!response.ok) {
    throw new Error(`Live API failed: ${response.status}`);
  }
  return response.json();
}

export function getResolvedApiBaseUrl() {
  return resolveBaseUrl();
}

async function jsonFetch(path, { method = 'GET', body, signal } = {}) {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `API failed: ${response.status}`);
  }
  return data;
}

export function fetchTemples({ signal } = {}) {
  return jsonFetch('/api/temples', { signal });
}

export function fetchAlerts({ status = 'active', templeId, signal } = {}) {
  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  if (templeId) qs.set('templeId', templeId);
  return jsonFetch(`/api/alerts?${qs.toString()}`, { signal });
}

export function postAck({ alertId, role }) {
  return jsonFetch(`/api/alerts/${alertId}/ack`, { method: 'POST', body: { role } });
}

export function postAction({ alertId, role, status, notes }) {
  return jsonFetch(`/api/alerts/${alertId}/actions`, {
    method: 'POST',
    body: { role, status, notes },
  });
}

export function fetchLogs({ signal } = {}) {
  return jsonFetch('/api/logs', { signal });
}

export function setReplayControl({ mode, speed, paused, seekIndex }) {
  return jsonFetch('/api/replay/control', { method: 'POST', body: { mode, speed, paused, seekIndex } });
}

export function registerDevice({ role, expoPushToken }) {
  return jsonFetch('/api/devices/register', { method: 'POST', body: { role, expoPushToken } });
}
