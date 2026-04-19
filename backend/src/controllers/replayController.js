// OWNER - ASU
// PURPOSE - Provide basic replay controls for the stream simulator (pause/seek/speed) and scenario list.

const {
  pauseStream,
  resumeStream,
  setStreamSpeed,
  seekStream,
  getStreamMeta,
} = require("../data/streamSimulator");
const { setMode, getMode } = require("../services/liveStateService");

function scenarios(req, res) {
  res.json({
    scenarios: [
      {
        id: "somnath_dataset",
        name: "Somnath Dataset Replay",
        description: "Replay the built-in Somnath dataset at variable speed.",
      },
    ],
  });
}

function control(req, res) {
  try {
    const { mode, speed, paused, seekIndex } = req.body || {};

    if (mode) setMode(mode);
    if (typeof speed === "number") {
      // speed 0.5, 1, 2 -> interval mapping around 1000ms
      const interval = Math.round(1000 / Math.max(0.1, speed));
      setStreamSpeed(interval);
    }
    if (typeof seekIndex === "number") seekStream(seekIndex);
    if (typeof paused === "boolean") {
      if (paused) pauseStream();
      else resumeStream();
    }

    res.json({ mode: getMode(), stream: getStreamMeta() });
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to control replay" });
  }
}

module.exports = { scenarios, control };

