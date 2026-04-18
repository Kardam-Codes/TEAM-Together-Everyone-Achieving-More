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
