// OWNER - KARDAM
// PURPOSE - Convert live engine output into a 0-100 pressure_score and severity buckets.

const SAFE_DENSITY = 3.5;

function clamp(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function roundInt(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num);
}

function computePressureScore({ density, risk, status }) {
  const densityNum = Number(density);
  const densityComponent = Number.isFinite(densityNum)
    ? clamp((densityNum / SAFE_DENSITY) * 50, 0, 70)
    : 0;

  const riskComponent = { LOW: 0, MEDIUM: 15, HIGH: 25 }[risk] ?? 0;
  const statusComponent = { STABLE: 0, SURGE: 5, CRUSH_BUILDUP: 10 }[status] ?? 0;

  return clamp(roundInt(densityComponent + riskComponent + statusComponent), 0, 100);
}

function severityFromScore(score) {
  if (score >= 75) return "DANGER";
  if (score >= 55) return "WARNING";
  if (score >= 35) return "WATCH";
  return "SAFE";
}

module.exports = {
  SAFE_DENSITY,
  computePressureScore,
  severityFromScore,
};

