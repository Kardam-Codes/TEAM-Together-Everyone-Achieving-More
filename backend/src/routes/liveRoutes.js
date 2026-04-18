// OWNER - ASU
// PURPOSE - Define live API routes for status, alerts, and acknowledgements

const express = require('express');
const router = express.Router();

const liveController = require('../controllers/liveController');
const ackController = require('../controllers/ackController');

router.get('/live', liveController.getLiveStatus);
router.get('/alert', liveController.getAlertStatus);
router.post('/ack', ackController.postAck);

module.exports = router;
