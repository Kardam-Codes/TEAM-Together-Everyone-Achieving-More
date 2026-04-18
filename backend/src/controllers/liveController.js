// OWNER - ASU
// PURPOSE - Handle live controller logic, calling engine contract and returning JSON responses

const { getCurrentState } = require('../services/engine');

const getLiveStatus = (req, res) => {
  try {
    const state = getCurrentState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live status' });
  }
};

const getAlertStatus = (req, res) => {
  try {
    const state = getCurrentState();
    // For now, return the same state; can differentiate later if needed
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert status' });
  }
};

module.exports = {
  getLiveStatus,
  getAlertStatus
};