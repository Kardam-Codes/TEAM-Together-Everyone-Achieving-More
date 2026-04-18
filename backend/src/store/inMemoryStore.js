// OWNER - KARDAM
// PURPOSE - In-memory storage for temples, corridors, live alerts, actions, acknowledgements, devices, and logs.

const crypto = require("crypto");

function newId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

const ROLES = ["TEMPLE_STAFF", "POLICE", "TRANSPORT"];

const store = {
  temples: [],
  corridors: [], // corridor objects (including offline ones)
  devices: [], // { id, role, expoPushToken, lastSeenAt }
  alertsActive: [], // active alert objects
  alertsResolved: [], // resolved alert objects (archived)
};

function getDefaultSomnathTemple() {
  return store.temples.find((t) => t.id === "somnath") || null;
}

function ensureSomnathTemple() {
  if (getDefaultSomnathTemple()) return;
  store.temples.push({
    id: "somnath",
    name: "Somnath",
    enabled: true,
  });
}

function listCorridorsByTemple(templeId) {
  return store.corridors.filter((c) => c.templeId === templeId);
}

function createTemple({ name }) {
  const id = newId("temple");
  const temple = { id, name: String(name || "").trim() || "New Temple", enabled: true };
  store.temples.push(temple);
  return temple;
}

function createCorridor({
  templeId,
  tableName,
  label,
  mapPosition,
  offline = true,
} = {}) {
  const id = newId("corridor");
  const corridor = {
    id,
    templeId,
    tableName: String(tableName || id),
    label: String(label || tableName || id),
    mapPosition: mapPosition || null,
    offline: Boolean(offline),
  };
  store.corridors.push(corridor);
  return corridor;
}

function upsertDevice({ role, expoPushToken }) {
  const now = new Date().toISOString();
  const normalizedRole = ROLES.includes(role) ? role : null;
  if (!normalizedRole) throw new Error("Invalid role");
  if (!expoPushToken || typeof expoPushToken !== "string") throw new Error("Invalid expoPushToken");

  const existing = store.devices.find((d) => d.expoPushToken === expoPushToken);
  if (existing) {
    existing.role = normalizedRole;
    existing.lastSeenAt = now;
    return existing;
  }

  const device = {
    id: newId("device"),
    role: normalizedRole,
    expoPushToken,
    lastSeenAt: now,
  };
  store.devices.push(device);
  return device;
}

module.exports = {
  ROLES,
  store,
  ensureSomnathTemple,
  listCorridorsByTemple,
  createTemple,
  createCorridor,
  upsertDevice,
};

