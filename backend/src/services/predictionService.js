// OWNER - KARDAM
// PURPOSE - Predict short-term crush risk from recent flow imbalance history and estimate crush-in minutes.

function getImbalance(row) {
  if (!row || typeof row !== "object") return null;

  if (Number.isFinite(Number(row.flow_imbalance))) {
    return Number(row.flow_imbalance);
  }

  const entry = Number(row.entry_flow_rate_pax_per_min);
  const exit = Number(row.exit_flow_rate_pax_per_min);
  if (!Number.isFinite(entry) || !Number.isFinite(exit)) return null;

  return entry - exit;
}

function clampInt(value, min, max) {
  const num = Math.round(Number(value));
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function predictRisk(
  history,
  {
    threshold = 20,
    minConsecutiveSteps = 3,
    maxLookbackSteps = 5,
  } = {}
) {
  const rows = Array.isArray(history) ? history : [];
  const lookback = rows.slice(-Math.max(1, maxLookbackSteps));

  let consecutiveAbove = 0;
  let latestImbalance = null;

  for (let i = lookback.length - 1; i >= 0; i -= 1) {
    const imbalance = getImbalance(lookback[i]);
    if (!Number.isFinite(imbalance)) break;

    if (latestImbalance === null) latestImbalance = imbalance;

    if (imbalance > threshold) {
      consecutiveAbove += 1;
      continue;
    }

    break;
  }

  if (consecutiveAbove >= minConsecutiveSteps && Number.isFinite(latestImbalance)) {
    const ratio = Math.max(0, (latestImbalance - threshold) / Math.max(1, threshold));
    const crushIn = clampInt(12 - Math.min(1, ratio) * 4, 8, 12);

    return {
      risk: "HIGH",
      crush_in: crushIn,
      meta: {
        consecutiveAbove,
        threshold,
        latestImbalance,
        lookbackSteps: lookback.length,
      },
    };
  }

  if (Number.isFinite(latestImbalance) && latestImbalance > threshold) {
    return {
      risk: "MEDIUM",
      crush_in: null,
      meta: {
        consecutiveAbove,
        threshold,
        latestImbalance,
        lookbackSteps: lookback.length,
      },
    };
  }

  return {
    risk: "LOW",
    crush_in: null,
    meta: {
      consecutiveAbove,
      threshold,
      latestImbalance,
      lookbackSteps: lookback.length,
    },
  };
}

module.exports = { predictRisk };

