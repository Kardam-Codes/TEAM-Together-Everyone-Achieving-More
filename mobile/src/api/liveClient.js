// OWNER - HEET
// PURPOSE - Fetch live multi-camera state from the backend and provide a simple polling helper.

const DEFAULT_BASE_URL = 'http://localhost:3000';

function resolveBaseUrl() {
  // For physical devices, set EXPO_PUBLIC_API_BASE_URL to something like:
  // http://192.168.x.x:3000
  return process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

export async function fetchLiveState({ signal } = {}) {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/live`, { signal });
  if (!response.ok) {
    throw new Error(`Live API failed: ${response.status}`);
  }
  return response.json();
}

