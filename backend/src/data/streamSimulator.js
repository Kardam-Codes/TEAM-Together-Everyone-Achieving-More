// OWNER - KARDAM
// PURPOSE - Stream rows from a chosen CSV at 1 row/second and expose the latest row for the API/engine layer.

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
    this._rows = [];
    this._tableName = DEFAULT_TABLE_NAME;
    this._emitIntervalMs = DEFAULT_EMIT_INTERVAL_MS;
    this._timer = null;
    this._index = 0;
    this._latestRow = null;
  }

  init({ tableName = DEFAULT_TABLE_NAME, emitIntervalMs = DEFAULT_EMIT_INTERVAL_MS } = {}) {
    this._tableName = tableName;
    this._emitIntervalMs = emitIntervalMs;

    const csvPath = resolveCsvForTable(this._tableName);
    const { rows } = loadCsvRows(csvPath);
    this._rows = rows;
    this._index = 0;
    this._latestRow = rows.length ? rows[0] : null;

    this.emit("init", {
      tableName: this._tableName,
      rowsLoaded: this._rows.length,
      emitIntervalMs: this._emitIntervalMs,
    });

    return this;
  }

  start() {
    if (this._timer) return;
    if (!this._rows.length) this.init({ tableName: this._tableName, emitIntervalMs: this._emitIntervalMs });

    this._timer = setInterval(() => {
      if (!this._rows.length) return;

      this._latestRow = this._rows[this._index];
      this.emit("row", this._latestRow);

      this._index = (this._index + 1) % this._rows.length;
    }, this._emitIntervalMs);

    this.emit("start", { tableName: this._tableName, emitIntervalMs: this._emitIntervalMs });
  }

  stop() {
    if (!this._timer) return;
    clearInterval(this._timer);
    this._timer = null;
    this.emit("stop", { tableName: this._tableName });
  }

  getLatestRow() {
    return this._latestRow;
  }

  getMeta() {
    return {
      tableName: this._tableName,
      rowsLoaded: this._rows.length,
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
  startStream: () => streamSimulator.start(),
  stopStream: () => streamSimulator.stop(),
  getLatestRow: () => streamSimulator.getLatestRow(),
  getStreamMeta: () => streamSimulator.getMeta(),
};
