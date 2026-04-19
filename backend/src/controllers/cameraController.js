const { createCamera, listCameras } = require('../store/inMemoryStore');

function addCamera(req, res) {
  try {
    const { cameraId, area, roles, feedUrl } = req.body;
    if (!cameraId || !area) {
      return res.status(400).json({ error: 'Camera ID and Area are required' });
    }
    
    const camera = createCamera({ cameraId, area, roles, feedUrl });
    res.status(201).json(camera);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function getCameras(req, res) {
  try {
    res.status(200).json(listCameras());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addCamera, getCameras };
