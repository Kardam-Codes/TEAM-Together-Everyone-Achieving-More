// OWNER - ASU
// PURPOSE - Serve resolved alerts as an event archive (log) for v1.

const { store } = require("../store/inMemoryStore");

function list(req, res) {
  try {
    const logs = store.alertsResolved.map((a) => ({
      id: `log_${a.id}`,
      alertId: a.id,
      templeId: a.templeId,
      corridorId: a.corridorId,
      createdAt: a.createdAt,
      resolvedAt: a.resolvedAt,
      peakPressureScore: a.peakPressureScore,
      severity: a.severity,
      timeline: {
        alertFiredAt: a.createdAt,
        acks: a.acks,
        actions: a.actions,
      },
      resolutionSummary: a.resolutionSummary || null,
    }));
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to list logs" });
  }
}

module.exports = { list };

