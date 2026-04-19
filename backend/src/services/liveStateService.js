// OWNER - KARDAM
// PURPOSE - Maintain the latest computed multi-camera state (with pressure_score + severity) and feed alert lifecycle.

const { streamSimulator } = require("../data/streamSimulator");
const { getAllCurrentStates } = require("./engine");
const { computePressureScore, severityFromScore } = require("./pressureService");
const { getCorridorByTableName } = require("./templeService");
const { updateAlertsFromLiveStates } = require("./alertService");

let lastLive = null;
let mode = "LIVE"; // LIVE | REPLAY (basic)

function computeEnrichedLive({ templeId = "somnath" } = {}) {
  const base = getAllCurrentStates();
  const cameras = {};
  const corridorStatesForAlerts = [];

  for (const [tableName, state] of Object.entries(base.cameras || {})) {
    const pressure_score = computePressureScore({
      density: state.density,
      risk: state.risk,
      status: state.status,
    });
    const severity = severityFromScore(pressure_score);
    const corridor = getCorridorByTableName({ templeId, tableName });

    const enriched = {
      ...state,
      templeId,
      corridorId: corridor?.id || null,
      pressure_score,
      severity,
      offline: corridor ? Boolean(corridor.offline) : false,
      label: corridor?.label || state.cctv_camera_location || tableName,
    };

    cameras[tableName] = enriched;
    corridorStatesForAlerts.push(enriched);
  }

  const live = {
    ...base,
    mode,
    cameras,
  };

  // update alerts based on enriched corridor states
  updateAlertsFromLiveStates({ templeId, corridorStates: corridorStatesForAlerts });

  return live;
}

function startLiveAggregation({ templeId = "somnath" } = {}) {
  // compute once at boot
  lastLive = computeEnrichedLive({ templeId });

  streamSimulator.on("tick", () => {
    lastLive = computeEnrichedLive({ templeId });
  });
}

function getLastLive() {
  return lastLive || computeEnrichedLive({ templeId: "somnath" });
}

function setMode(nextMode) {
  if (nextMode !== "LIVE" && nextMode !== "REPLAY") return;
  mode = nextMode;
}

function getMode() {
  return mode;
}

module.exports = {
  startLiveAggregation,
  getLastLive,
  setMode,
  getMode,
};

