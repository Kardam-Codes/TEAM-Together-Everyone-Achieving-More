// OWNER - ASU
// PURPOSE - Serve alerts, acknowledgements, and actions endpoints.

const { listAlerts, ackAlert, updateAction } = require("../services/alertService");

function list(req, res) {
  try {
    const status = req.query.status || "active";
    const templeId = req.query.templeId || null;
    const alerts = listAlerts({ status, templeId });
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: "Failed to list alerts" });
  }
}

function ack(req, res) {
  try {
    const alertId = req.params.alertId;
    const { role } = req.body || {};
    const alert = ackAlert({ alertId, role });
    res.json({ alert });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to acknowledge alert" });
  }
}

function setAction(req, res) {
  try {
    const alertId = req.params.alertId;
    const { role, status, notes } = req.body || {};
    const alert = updateAction({ alertId, role, status, notes });
    res.json({ alert });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to update action" });
  }
}

function notify(req, res) {
  try {
    const alertId = req.params.alertId;
    const { notifyAuthorities } = require("../services/alertService");
    notifyAuthorities({ alertId })
      .then((alert) => res.json({ alert }))
      .catch((err) => res.status(400).json({ error: err?.message || "Failed to notify authorities" }));
  } catch (err) {
    res.status(400).json({ error: "Failed to notify authorities" });
  }
}

module.exports = { list, ack, setAction, notify };

