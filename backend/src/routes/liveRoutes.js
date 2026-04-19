// OWNER - ASU
// PURPOSE - Define live API routes for status, alerts, and acknowledgements

const express = require('express');
const router = express.Router();

const liveController = require('../controllers/liveController');
const ackController = require('../controllers/ackController');
const templesController = require('../controllers/templesController');
const alertsController = require('../controllers/alertsController');
const replayController = require('../controllers/replayController');
const devicesController = require('../controllers/devicesController');
const logsController = require('../controllers/logsController');

router.get('/live', liveController.getLiveStatus);
router.get('/alert', liveController.getAlertStatus);
router.post('/ack', ackController.postAck);

// Temples / Corridors
router.get('/temples', templesController.listTemples);
router.post('/temples', templesController.createTemple);
router.post('/temples/:templeId/corridors', templesController.createCorridor);

// Alerts / Acks / Actions
router.get('/alerts', alertsController.list);
router.post('/alerts/:alertId/ack', alertsController.ack);
router.post('/alerts/:alertId/actions', alertsController.setAction);
router.post('/alerts/:alertId/notify', alertsController.notify);

// Logs
router.get('/logs', logsController.list);

// Replay
router.get('/replay/scenarios', replayController.scenarios);
router.post('/replay/control', replayController.control);

// Notifications devices
router.post('/devices/register', devicesController.register);

module.exports = router;
