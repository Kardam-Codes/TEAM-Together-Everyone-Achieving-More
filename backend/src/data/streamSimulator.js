// OWNER - KARDAM
// PURPOSE - Stream rows from dataset CSVs at 1 row/second for one or many CCTV locations and expose latest rows to the engine/API.

const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");

const DEFAULT_TABLE_NAME = "main_entry_gate";
const DEFAULT_EMIT_INTERVAL_MS = 1000;

function parseMaybeNumber(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed === "") return null;
  if (/^-?\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return Number.parseFloat(trimmed);
  return trimmed;
}

function parseCsvLine(line) {
  // Assumption: dataset CSVs are simple (no quoted commas).
  return line.split(",").map((cell) => cell.trim());
}

function inferRowTypes(headers, rawValues) {
  const row = {};
  for (let i = 0; i < headers.length; i += 1) {
    const key = headers[i];
    const raw = rawValues[i];

    if (
      key === "timestamp" ||
      key === "cctv_camera_location" ||
      key === "weather" ||
      key === "risk_phase"
    ) {
      row[key] = String(raw ?? "");
      continue;
    }

    row[key] = parseMaybeNumber(raw);
  }
  return row;
}

function resolveDatasetPath() {
  // backend/src/data -> project root -> dataset
  return path.resolve(__dirname, "..", "..", "..", "dataset");
}

function loadManifest() {
  const datasetDir = resolveDatasetPath();
  const manifestPath = path.join(datasetDir, "table_manifest.json");
  const raw = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(raw);
}

function resolveCsvForTable(tableName) {
  const manifest = loadManifest();
  const entry = manifest.find((t) => t.table_name === tableName);
  if (!entry) {
    const known = manifest.map((t) => t.table_name).join(", ");
    throw new Error(
      `Unknown table_name "${tableName}". Known tables: ${known || "(none)"}`
    );
  }
  const datasetDir = resolveDatasetPath();
  return path.join(datasetDir, entry.csv_file);
}

function loadCsvRows(csvPath) {
  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return inferRowTypes(headers, values);
  });

  return { headers, rows };
}

class StreamSimulator extends EventEmitter {
  constructor() {
    super();
    this._tables = new Map(); // tableName -> { rows }
    this._tableNames = [];
    this._defaultTableName = DEFAULT_TABLE_NAME;
    this._emitIntervalMs = DEFAULT_EMIT_INTERVAL_MS;
    this._timer = null;
    this._index = 0;
    this._latestByTable = new Map(); // tableName -> row
    this._initialized = false;
  }

  initAll({
    tableNames,
    defaultTableName = DEFAULT_TABLE_NAME,
    emitIntervalMs = DEFAULT_EMIT_INTERVAL_MS,
  } = {}) {
    const manifest = loadManifest();
    const resolvedTableNames =
      Array.isArray(tableNames) && tableNames.length
        ? tableNames
        : manifest.map((t) => t.table_name);

    this._tableNames = resolvedTableNames;
    this._defaultTableName = defaultTableName;
    this._emitIntervalMs = emitIntervalMs;

    this._tables.clear();
    this._latestByTable.clear();

    for (const tableName of this._tableNames) {
      const csvPath = resolveCsvForTable(tableName);
      const { rows } = loadCsvRows(csvPath);
      this._tables.set(tableName, { rows });
      this._latestByTable.set(tableName, rows.length ? rows[0] : null);
    }

    this._index = 0;
    this._initialized = true;

    this.emit("init", {
      tableNames: this._tableNames,
      emitIntervalMs: this._emitIntervalMs,
    });

    return this;
  }

  init({ tableName = DEFAULT_TABLE_NAME, emitIntervalMs = DEFAULT_EMIT_INTERVAL_MS } = {}) {
    return this.initAll({
      tableNames: [tableName],
      defaultTableName: tableName,
      emitIntervalMs,
    });
  }

  start() {
    if (this._timer) return;
    if (!this._initialized) this.initAll();

    this._timer = setInterval(() => {
      if (!this._tableNames.length) return;

      const payload = {};
      for (const tableName of this._tableNames) {
        const table = this._tables.get(tableName);
        const rows = table?.rows || [];
        if (!rows.length) {
          this._latestByTable.set(tableName, null);
          payload[tableName] = null;
          continue;
        }

        const row = rows[this._index % rows.length];
        this._latestByTable.set(tableName, row);
        payload[tableName] = row;

        this.emit("row", { tableName, row });
      }

      this.emit("tick", { index: this._index, rows: payload });
      this._index += 1;
    }, this._emitIntervalMs);

    this.emit("start", { tableNames: this._tableNames, emitIntervalMs: this._emitIntervalMs });
  }

  stop() {
    if (!this._timer) return;
    clearInterval(this._timer);
    this._timer = null;
    this.emit("stop", { tableNames: this._tableNames });
  }

  _ensureRunning() {
    if (!this._initialized) this.initAll();
    if (!this._timer) this.start();
  }

  getLatestRow(tableName = this._defaultTableName) {
    this._ensureRunning();
    return this._latestByTable.get(tableName) ?? null;
  }

  getLatestRows() {
    this._ensureRunning();
    const out = {};
    for (const name of this._tableNames) out[name] = this._latestByTable.get(name) ?? null;
    return out;
  }

  getMeta() {
    return {
      tableNames: this._tableNames,
      defaultTableName: this._defaultTableName,
      emitIntervalMs: this._emitIntervalMs,
      index: this._index,
      running: Boolean(this._timer),
    };
  }
}

const streamSimulator = new StreamSimulator();

module.exports = {
  streamSimulator,
  initStream: (opts) => streamSimulator.init(opts),
  initAllStreams: (opts) => streamSimulator.initAll(opts),
  startStream: () => streamSimulator.start(),
  stopStream: () => streamSimulator.stop(),
  getLatestRow: (tableName) => streamSimulator.getLatestRow(tableName),
  getLatestRows: () => streamSimulator.getLatestRows(),
  getStreamMeta: () => streamSimulator.getMeta(),
};
