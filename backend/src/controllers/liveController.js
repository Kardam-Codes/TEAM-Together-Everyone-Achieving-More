// OWNER - ASU
// PURPOSE - Handle live controller logic, calling engine contract and returning JSON responses

const { getLastLive } = require('../services/liveStateService');

const getLiveStatus = (req, res) => {
  try {
    res.json(getLastLive());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live status' });
  }
};

const getAlertStatus = (req, res) => {
  try {
    // For v1, keep same shape as /live
    res.json(getLastLive());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert status' });
  }
};

module.exports = {
  getLiveStatus,
  getAlertStatus
};
