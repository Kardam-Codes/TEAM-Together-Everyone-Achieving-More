// OWNER - KARDAM
// PURPOSE - Compute CPI (crowd/flow pressure indicator) from entry/exit flow imbalance normalized by corridor width.

function calculateCPI(entry, exit, width) {
  const safeWidth = Number(width);
  if (!Number.isFinite(safeWidth) || safeWidth === 0) return null;

  const entryNum = Number(entry);
  const exitNum = Number(exit);
  if (!Number.isFinite(entryNum) || !Number.isFinite(exitNum)) return null;

  const imbalance = entryNum - exitNum;
  return imbalance / safeWidth;
}

module.exports = { calculateCPI };

