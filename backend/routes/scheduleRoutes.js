const express = require('express');
const router = express.Router();
const {
    createLedSchedule,
    createFanSchedule,
    deleteSchedule,
    getSchedules
} = require('../controllers/scheduleController');
const { authenticateMiddleware } = require('../middleware/auth');
router.post('/createLedSchedule', authenticateMiddleware, createLedSchedule);
router.post('/createFanSchedule', authenticateMiddleware, createFanSchedule);
router.delete('/deleteSchedule/:scheduleId', authenticateMiddleware, deleteSchedule);
router.get('/all', authenticateMiddleware, getSchedules);;
module.exports = router;