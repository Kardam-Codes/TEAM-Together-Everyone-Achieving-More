// OWNER - KARDAM
// PURPOSE - Maintain alert lifecycle from live corridor states and track acks/actions/logs (in-memory).

const crypto = require("crypto");
const { store, ROLES } = require("../store/inMemoryStore");
const { sendExpoPush } = require("./notificationService");

const SAFE_STREAK_TO_RESOLVE = 10;

function nowIso() {
  return new Date().toISOString();
}

function newAlertId() {
  return `alert_${crypto.randomUUID()}`;
}

function defaultAcks() {
  const out = {};
  for (const role of ROLES) {
    out[role] = { role, ackedAt: null, responseSeconds: null };
  }
  return out;
}

function defaultActions() {
  return {
    TEMPLE_AGENCY: {
      role: "TEMPLE_AGENCY",
      recommended: "Pause entry / hold incoming queue at outer gate.",
      status: "PENDING",
      updatedAt: null,
      notes: null,
    },
    POLICE: {
      role: "POLICE",
      recommended: "Dispatch crowd-control unit to the affected corridor.",
      status: "PENDING",
      updatedAt: null,
      notes: null,
    },
    TRANSPORT: {
      role: "TRANSPORT",
      recommended: "Hold arrivals and divert inflow until pressure drops.",
      status: "PENDING",
      updatedAt: null,
      notes: null,
    },
    ADMIN: {
      role: "ADMIN",
      recommended: "Oversee coordination and escalate if necessary.",
      status: "PENDING",
      updatedAt: null,
      notes: null,
    },
  };
}

function predictedWindowFromCrushIn({ crush_in }) {
  if (typeof crush_in !== "number") return null;
  const now = Date.now();
  const start = new Date(now + (crush_in - 2) * 60_000).toISOString();
  const end = new Date(now + (crush_in + 4) * 60_000).toISOString();
  return { start, end };
}

function findActiveAlertForCorridor(corridorId) {
  return store.alertsActive.find((a) => a.corridorId === corridorId) || null;
}

function archiveResolvedAlert(alert, resolutionSummary) {
  const resolved = {
    ...alert,
    resolvedAt: nowIso(),
    resolutionSummary: resolutionSummary || "Pressure normalized.",
  };
  store.alertsResolved.unshift(resolved);
  store.alertsResolved = store.alertsResolved.slice(0, 500);
}

async function maybeNotifyDanger(alert, { reason }) {
  const tokens = store.devices.map((d) => d.expoPushToken);
  await sendExpoPush({
    tokens,
    title: `DANGER: ${alert.severity}`,
    body: `${alert.triggerSnapshot?.cctv_camera_location || alert.corridorId} — score ${alert.peakPressureScore}`,
    data: { alertId: alert.id, reason, severity: alert.severity },
  });
}

function updateAlertsFromLiveStates({ templeId, corridorStates }) {
  const tickAt = nowIso();

  for (const state of corridorStates) {
    const corridorId = state.corridorId;
    if (!corridorId) continue;

    const existing = findActiveAlertForCorridor(corridorId);
    const isWarningOrDanger = state.severity === "WARNING" || state.severity === "DANGER";
    const isSafe = state.severity === "SAFE";

    if (!existing && isWarningOrDanger) {
      const alert = {
        id: newAlertId(),
        templeId,
        corridorId,
        severity: state.severity,
        createdAt: tickAt,
        updatedAt: tickAt,
        resolvedAt: null,
        triggerSnapshot: {
          table_name: state.table_name,
          timestamp: state.timestamp,
          cctv_camera_location: state.cctv_camera_location,
          cpi: state.cpi,
          density: state.density,
          risk: state.risk,
          status: state.status,
          pressure_score: state.pressure_score,
          severity: state.severity,
        },
        predictedWindow: predictedWindowFromCrushIn({ crush_in: state.crush_in }),
        acks: defaultAcks(),
        actions: defaultActions(),
        peakPressureScore: state.pressure_score,
        safeStreak: 0,
      };

      store.alertsActive.unshift(alert);
      store.alertsActive = store.alertsActive.slice(0, 200);

      if (alert.severity === "DANGER") {
        // ADMIN Auto-Trigger Logic: Automatically dispatch Police and Transport
        if (alert.actions?.POLICE) {
          alert.actions.POLICE.status = "DISPATCHED";
          alert.actions.POLICE.notes = "[AUTO-TRIGGER] Automatically dispatched due to DANGER level.";
          alert.actions.POLICE.updatedAt = tickAt;
        }
        if (alert.actions?.TRANSPORT) {
          alert.actions.TRANSPORT.status = "DISPATCHED";
          alert.actions.TRANSPORT.notes = "[AUTO-TRIGGER] Automatically dispatched due to DANGER level.";
          alert.actions.TRANSPORT.updatedAt = tickAt;
        }
        // fire-and-forget best-effort
        maybeNotifyDanger(alert, { reason: "new_danger" });
      }
      continue;
    }

    if (existing) {
      existing.updatedAt = tickAt;
      existing.severity = state.severity;
      existing.peakPressureScore = Math.max(existing.peakPressureScore || 0, state.pressure_score || 0);
      existing.predictedWindow = predictedWindowFromCrushIn({ crush_in: state.crush_in });

      if (state.severity === "DANGER" && existing._notifiedDanger !== true) {
        existing._notifiedDanger = true;
        maybeNotifyDanger(existing, { reason: "escalated_danger" });
      }

      if (isSafe) existing.safeStreak = (existing.safeStreak || 0) + 1;
      else existing.safeStreak = 0;

      if (existing.safeStreak >= SAFE_STREAK_TO_RESOLVE) {
        store.alertsActive = store.alertsActive.filter((a) => a.id !== existing.id);
        archiveResolvedAlert(existing, "Pressure dropped to safe levels.");
      }
    }
  }
}

function listAlerts({ status, templeId }) {
  const byTemple = (a) => (templeId ? a.templeId === templeId : true);
  if (status === "resolved") return store.alertsResolved.filter(byTemple);
  return store.alertsActive.filter(byTemple);
}

function ackAlert({ alertId, role }) {
  const normalizedRole = ROLES.includes(role) ? role : null;
  if (!normalizedRole) throw new Error("Invalid role");

  const alert = store.alertsActive.find((a) => a.id === alertId) || store.alertsResolved.find((a) => a.id === alertId);
  if (!alert) throw new Error("Alert not found");

  const entry = alert.acks?.[normalizedRole];
  if (!entry) throw new Error("Ack row missing");
  if (entry.ackedAt) return alert;

  const ackedAt = nowIso();
  entry.ackedAt = ackedAt;
  entry.responseSeconds = Math.max(0, Math.round((Date.parse(ackedAt) - Date.parse(alert.createdAt)) / 1000));
  alert.updatedAt = ackedAt;
  return alert;
}

function updateAction({ alertId, role, status, notes }) {
  const normalizedRole = ROLES.includes(role) ? role : null;
  if (!normalizedRole) throw new Error("Invalid role");

  const alert = store.alertsActive.find((a) => a.id === alertId) || store.alertsResolved.find((a) => a.id === alertId);
  if (!alert) throw new Error("Alert not found");

  const action = alert.actions?.[normalizedRole];
  if (!action) throw new Error("Action row missing");

  action.status = String(status || "PENDING");
  action.updatedAt = nowIso();
  action.notes = typeof notes === "string" ? notes : null;
  alert.updatedAt = action.updatedAt;
  return alert;
}

async function notifyAuthorities({ alertId }) {
  const alert = store.alertsActive.find((a) => a.id === alertId);
  if (!alert) throw new Error("Alert not found");

  alert._authoritiesNotifiedAt = nowIso();
  if (alert.acks?.ADMIN && !alert.acks.ADMIN.ackedAt) {
    alert.acks.ADMIN.ackedAt = nowIso();
  }
  alert.updatedAt = nowIso();

  const tokens = store.devices.filter(d => d.role !== 'ADMIN').map((d) => d.expoPushToken);
  await sendExpoPush({
    tokens,
    title: `ADMIN DISPATCH: ${alert.severity}`,
    body: `Admin requests acknowledgement for ${alert.corridorId}`,
    data: { alertId: alert.id, reason: "admin_dispatch" },
  });

  return alert;
}

module.exports = {
  SAFE_STREAK_TO_RESOLVE,
  updateAlertsFromLiveStates,
  listAlerts,
  ackAlert,
  updateAction,
  notifyAuthorities,
};

