// OWNER - ASU
// PURPOSE - Register Expo push tokens by role for server-side notifications.

const { upsertDevice } = require("../store/inMemoryStore");

function register(req, res) {
  try {
    const { role, expoPushToken } = req.body || {};
    const device = upsertDevice({ role, expoPushToken });
    res.status(201).json({ device });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to register device" });
  }
}

module.exports = { register };

