// OWNER - KARDAM
// PURPOSE - Classify recent crowd behavior as CRUSH_BUILDUP (continuous rise) vs SURGE (spike then drop).

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function getDensity(row) {
  if (!row || typeof row !== "object") return null;
  return toNumber(row.queue_density_pax_per_m2);
}

function takeLast(array, count) {
  if (!Array.isArray(array) || count <= 0) return [];
  return array.slice(-count);
}

function diffs(values) {
  const out = [];
  for (let i = 1; i < values.length; i += 1) {
    out.push(values[i] - values[i - 1]);
  }
  return out;
}

function isContinuousRise(values, { minPoints = 4, riseEpsilon = 0.03, minTotalRise = 0.2 } = {}) {
  if (values.length < minPoints) return false;

  const recent = takeLast(values, minPoints);
  const deltas = diffs(recent);

  const allRising = deltas.every((d) => d > riseEpsilon);
  const totalRise = recent[recent.length - 1] - recent[0];

  return allRising && totalRise >= minTotalRise;
}

function isSpikeThenDrop(
  values,
  {
    window = 8,
    spikeMin = 0.5,
    dropMin = 0.3,
    settleTolerance = 0.2,
  } = {}
) {
  const series = takeLast(values, window);
  if (series.length < 5) return false;

  const start = series[0];
  const end = series[series.length - 1];

  let peak = -Infinity;
  let peakIndex = -1;
  for (let i = 0; i < series.length; i += 1) {
    if (series[i] > peak) {
      peak = series[i];
      peakIndex = i;
    }
  }

  // Peak must be inside the window, not the very last point.
  if (peakIndex <= 0 || peakIndex >= series.length - 1) return false;

  const spikeUp = peak - start;
  const dropDown = peak - end;
  const settledNearStart = Math.abs(end - start) <= settleTolerance;

  return spikeUp >= spikeMin && dropDown >= dropMin && settledNearStart;
}

function classifyStatus(history, opts = {}) {
  const rows = Array.isArray(history) ? history : [];
  const densities = rows
    .map(getDensity)
    .filter((d) => d !== null);

  if (!densities.length) {
    return { status: "STABLE", meta: { reason: "no_density" } };
  }

  if (isContinuousRise(densities, opts.continuousRise)) {
    return { status: "CRUSH_BUILDUP", meta: { signal: "continuous_rise" } };
  }

  if (isSpikeThenDrop(densities, opts.spikeThenDrop)) {
    return { status: "SURGE", meta: { signal: "spike_then_drop" } };
  }

  return { status: "STABLE", meta: { signal: "none" } };
}

module.exports = { classifyStatus };

