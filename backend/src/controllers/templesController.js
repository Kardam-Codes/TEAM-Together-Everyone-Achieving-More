// OWNER - ASU
// PURPOSE - Serve temple and corridor metadata; allow adding temples and CCTV corridors (offline placeholders).

const { getTemplesWithCorridors, addTemple, addCorridor } = require("../services/templeService");

function listTemples(req, res) {
  try {
    const temples = getTemplesWithCorridors();
    res.json({ temples });
  } catch (err) {
    res.status(500).json({ error: "Failed to list temples" });
  }
}

function createTemple(req, res) {
  try {
    const { name } = req.body || {};
    const temple = addTemple({ name });
    res.status(201).json({ temple });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to create temple" });
  }
}

function createCorridor(req, res) {
  try {
    const templeId = req.params.templeId;
    const { tableName, label, mapPosition } = req.body || {};
    const corridor = addCorridor(templeId, { tableName, label, mapPosition });
    res.status(201).json({ corridor });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to create corridor" });
  }
}

module.exports = { listTemples, createTemple, createCorridor };

