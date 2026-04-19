const express = require('express');
const { addCamera, getCameras } = require('../controllers/cameraController');

const router = express.Router();

router.post('/', addCamera);
router.get('/', getCameras);

module.exports = router;
