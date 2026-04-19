// OWNER - KARDAM
// PURPOSE - Combine stream + CPI + prediction + classification into stable integration contracts for single and all CCTV states.

const { getLatestRow, getLatestRows, getStreamMeta } = require("../data/streamSimulator");
const { calculateCPI } = require("../utils/calculateCPI");
const { predictRisk } = require("./predictionService");
const { classifyStatus } = require("./classificationService");

const DEFAULT_HISTORY_LIMIT = 10;

const historyByTable = new Map(); // tableName -> row[]
const lastTimestampByTable = new Map(); // tableName -> timestamp string

function ensureHistory(tableName) {
  if (!historyByTable.has(tableName)) historyByTable.set(tableName, []);
  return historyByTable.get(tableName);
}

function pushHistoryIfNew(tableName, row, limit = DEFAULT_HISTORY_LIMIT) {
  if (!row) return;
  const ts = typeof row.timestamp === "string" ? row.timestamp : null;
  const lastTs = lastTimestampByTable.get(tableName) ?? null;
  if (ts && lastTs === ts) return;
  if (ts) lastTimestampByTable.set(tableName, ts);

  const buffer = ensureHistory(tableName);
  buffer.push(row);
  while (buffer.length > limit) buffer.shift();
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function round(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
}

function computeDensity(row) {
  if (!row || typeof row !== "object") return null;
  return toNumber(row.queue_density_pax_per_m2);
}

function computeStateForTable(tableName, current, options = {}) {
  const {
    historyLimit = DEFAULT_HISTORY_LIMIT,
    predictionOptions,
    classificationOptions,
  } = options;

  if (!current) {
    return {
      table_name: tableName,
      cpi: null,
      risk: "LOW",
      crush_in: null,
      density: null,
      status: "STABLE",
    };
  }

  pushHistoryIfNew(tableName, current, historyLimit);
  const historyBuffer = ensureHistory(tableName);

  const entry = toNumber(current.entry_flow_rate_pax_per_min);
  const exit = toNumber(current.exit_flow_rate_pax_per_min);
  const width = toNumber(current.corridor_width_m);

  const cpi = calculateCPI(entry, exit, width);
  const density = computeDensity(current);

  const prediction = predictRisk(historyBuffer, predictionOptions);
  const classification = classifyStatus(historyBuffer, classificationOptions);

  return {
    table_name: tableName,
    timestamp: typeof current.timestamp === "string" ? current.timestamp : null,
    cctv_camera_location:
      typeof current.cctv_camera_location === "string"
        ? current.cctv_camera_location
        : null,
    cpi: round(cpi, 2),
    risk: prediction.risk,
    crush_in: prediction.crush_in,
    density: round(density, 2),
    status: classification.status,
    reasons: [
      density > 3.5 ? 'Density above safe limit (3.5 persons/m²)' : null,
      prediction.risk === 'HIGH' ? 'Crush risk predicted 8-12m ahead' : null,
      classification.status === 'CRUSH_BUILDUP' ? 'Continuous crowd buildup detected' : null,
    ].filter(Boolean),
  };
}

function getCurrentState(tableName, options = {}) {
  const meta = getStreamMeta();
  const resolved = tableName || meta.defaultTableName || undefined;
  const current = getLatestRow(resolved);
  return computeStateForTable(resolved, current, options);
}

function getAllCurrentStates(options = {}) {
  const meta = getStreamMeta();
  const latest = getLatestRows();
  const tableNames = meta.tableNames || Object.keys(latest);

  const cameras = {};
  let syncedTimestamp = null;

  for (const tableName of tableNames) {
    const row = latest[tableName] ?? null;
    const state = computeStateForTable(tableName, row, options);
    cameras[tableName] = state;
    if (!syncedTimestamp && state.timestamp) syncedTimestamp = state.timestamp;
  }

  return {
    timestamp: syncedTimestamp,
    cameras,
    meta: {
      stream: meta,
    },
  };
}

module.exports = { getCurrentState, getAllCurrentStates };

