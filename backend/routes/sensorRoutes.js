const express = require('express');
const router = express.Router();
const {
  updateTempValue,
  getTempValue,
  updateHumiValue,
  getHumiValue,
  getALLTempValue,
  getALLHumiValue
} = require('../controllers/sensorController');
const { authenticateMiddleware } = require('../middleware/auth');

// Temperature sensor routes
router.post('/temp/update', authenticateMiddleware, updateTempValue);
router.get('/temp', authenticateMiddleware, getTempValue);
router.get('/temp/all', authenticateMiddleware, getALLTempValue);

// Humidity sensor routes
router.post('/humi/update', authenticateMiddleware, updateHumiValue);
router.get('/humi', authenticateMiddleware, getHumiValue);
router.get('/humi/all', authenticateMiddleware, getALLHumiValue);

module.exports = router;
