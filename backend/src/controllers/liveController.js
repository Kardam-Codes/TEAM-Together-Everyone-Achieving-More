// OWNER - ASU
// PURPOSE - Handle live controller logic, calling engine contract and returning JSON responses

const { getAllCurrentStates, getCurrentState } = require('../services/engine');

const getLiveStatus = (req, res) => {
  try {
    const state = getAllCurrentStates();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live status' });
  }
};

const getAlertStatus = (req, res) => {
  try {
    // For now, return the same shape as /live; can differentiate later if needed
    const state = getAllCurrentStates();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert status' });
  }
};

module.exports = {
  getLiveStatus,
  getAlertStatus
};
