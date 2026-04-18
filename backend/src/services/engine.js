// OWNER - KARDAM
// PURPOSE - Combine stream + CPI + prediction + classification into one stable integration contract: getCurrentState().

const { getLatestRow } = require("../data/streamSimulator");
const { calculateCPI } = require("../utils/calculateCPI");
const { predictRisk } = require("./predictionService");
const { classifyStatus } = require("./classificationService");

const DEFAULT_HISTORY_LIMIT = 10;

const historyBuffer = [];

function pushHistory(row, limit = DEFAULT_HISTORY_LIMIT) {
  if (!row) return;
  historyBuffer.push(row);
  while (historyBuffer.length > limit) historyBuffer.shift();
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

function getCurrentState(options = {}) {
  const {
    historyLimit = DEFAULT_HISTORY_LIMIT,
    predictionOptions,
    classificationOptions,
  } = options;

  const current = getLatestRow();
  if (!current) {
    return {
      cpi: null,
      risk: "LOW",
      crush_in: null,
      density: null,
      status: "STABLE",
    };
  }

  pushHistory(current, historyLimit);

  const entry = toNumber(current.entry_flow_rate_pax_per_min);
  const exit = toNumber(current.exit_flow_rate_pax_per_min);
  const width = toNumber(current.corridor_width_m);

  const cpi = calculateCPI(entry, exit, width);
  const density = computeDensity(current);

  const prediction = predictRisk(historyBuffer, predictionOptions);
  const classification = classifyStatus(historyBuffer, classificationOptions);

  return {
    cpi: round(cpi, 2),
    risk: prediction.risk,
    crush_in: prediction.crush_in,
    density: round(density, 2),
    status: classification.status,
  };
}

module.exports = { getCurrentState };

