// OWNER - ASU
// PURPOSE - Express server setup, mounting routes, configuring CORS/JSON middleware for mobile app

const express = require('express');
const cors = require('cors');

const { initAllStreams, startStream, getStreamMeta } = require('./data/streamSimulator');

const app = express();

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Placeholder for mounting routes - routes will be added in liveRoutes.js
const liveRoutes = require('./routes/liveRoutes');
app.use('/api', liveRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  try {
    initAllStreams({
      emitIntervalMs: Number(process.env.STREAM_INTERVAL_MS) || 1000,
    });
    startStream();
    const meta = getStreamMeta();
    console.log(`Stream started for tables: ${(meta.tableNames || []).join(', ')}`);
  } catch (err) {
    console.error('Failed to start stream simulator:', err?.message || err);
  }
});
