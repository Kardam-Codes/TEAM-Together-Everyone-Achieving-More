// OWNER - ASU
// PURPOSE - Express server setup, mounting routes, configuring CORS/JSON middleware for mobile app

const express = require('express');
const cors = require('cors');

const { initAllStreams, startStream, getStreamMeta } = require('./data/streamSimulator');
const { ensureSomnathCorridorsFromManifest } = require('./services/templeService');
const { startLiveAggregation } = require('./services/liveStateService');

const app = express();

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mount routes
const liveRoutes = require('./routes/liveRoutes');
const authRoutes = require('./routes/authRoutes');
const cameraRoutes = require('./routes/cameraRoutes');

app.use('/api', liveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  try {
    ensureSomnathCorridorsFromManifest();
    initAllStreams({
      emitIntervalMs: Number(process.env.STREAM_INTERVAL_MS) || 1000,
    });
    startStream();
    startLiveAggregation({ templeId: "somnath" });
    const meta = getStreamMeta();
    console.log(`Stream started for tables: ${(meta.tableNames || []).join(', ')}`);
  } catch (err) {
    console.error('Failed to start stream simulator:', err?.message || err);
  }
});
