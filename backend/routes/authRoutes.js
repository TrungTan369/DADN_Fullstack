const express = require('express');
const router = express.Router();
const { registerUser, loginUser, profile, changePassword, getLastUsedDevices } = require('../controllers/authController');
const {authenticateMiddleware} = require('../middleware/auth')
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateMiddleware, profile);
router.put("/change-password", authenticateMiddleware, changePassword);
router.get('/last-used', authenticateMiddleware, getLastUsedDevices);
module.exports = router;