const Device = require('../models/device');
require('dotenv').config();
const axios = require('axios');

const turnONLed_medium = async (req, res) => {
    console.log("turnONLed_medium")
    try {
        const userId = req.user._id;
        const led = await Device.findOne({ owner_id: userId, type: 'led' });

        if (!led) {
            return res.status(404).json({ success: false, message: 'LED not found' });
        }

        led.current_value = "50";
        const timestamp = new Date();
        led.history.push({ value: "50", timestamp });
        await led.save();

        const blynkUrl = process.env.LED + "50";
        await axios.get(blynkUrl);

        const io = req.app.get('socketio');
        io.emit('led:update', { value: "50", timestamp });

        res.status(200).json({ success: true, message: "turnONLed success" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const turnONLed_max = async (req, res) => {
    try {
        const userId = req.user._id;
        const led = await Device.findOne({ owner_id: userId, type: 'led' });

        if (!led) {
            return res.status(404).json({ success: false, message: 'LED not found' });
        }

        led.current_value = "99";
        const timestamp = new Date();
        led.history.push({ value: "99", timestamp });
        await led.save();

        const blynkUrl = process.env.LED + "99";
        await axios.get(blynkUrl);

        const io = req.app.get('socketio');
        io.emit('led:update', { value: "99", timestamp });

        res.status(200).json({ success: true, message: "turnONLed success" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const turnOFFLed = async (req, res) => {
    try {
        const userId = req.user._id;
        const led = await Device.findOne({ owner_id: userId, type: 'led' });

        if (!led) {
            return res.status(404).json({ success: false, message: 'LED not found' });
        }

        const timestamp = new Date();
        led.current_value = "0";
        led.history.push({ value: "0", timestamp });
        await led.save();

        const blynkUrl = process.env.LED + "0";
        await axios.get(blynkUrl);

        const io = req.app.get('socketio');
        io.emit('led:update', { value: "0", timestamp });

        res.status(200).json({ success: true, message: "turnOFFLed success" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const turnONAutoLed = async (req, res) => {
    try {
        const userId = req.user._id;
        const autoled = await Device.findOne({ owner_id: userId, type: 'autoled' });

        if (!autoled) {
            return res.status(404).json({ success: false, message: 'AUTOLED not found' });
        }

        const timestamp = new Date();
        autoled.history.push({ value: "on", timestamp });
        autoled.status = "online";
        await autoled.save();

        const blynkUrl = process.env.AUTOLED + "1";
        await axios.get(blynkUrl);

        const io = req.app.get('socketio');
        io.emit('autoled:update', { value: "on", status: "online", timestamp });

        res.status(200).json({ success: true, message: "turnONAutoLed success" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const turnOFFAutoLed = async (req, res) => {
    try {
        const userId = req.user._id;
        const autoled = await Device.findOne({ owner_id: userId, type: 'autoled' });

        if (!autoled) {
            return res.status(404).json({ success: false, message: 'AUTOLED not found' });
        }

        const timestamp = new Date();
        autoled.history.push({ value: "off", timestamp });
        autoled.status = "offline";
        await autoled.save();

        const blynkUrl = process.env.AUTOLED + "0";
        await axios.get(blynkUrl);

        const io = req.app.get('socketio');
        io.emit('autoled:update', { value: "off", status: "offline", timestamp });

        res.status(200).json({ success: true, message: "turnOFFAutoLed success" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const turnONMotionMode = async (req, res) => {
    try{
        const userId = req.user._id;
        const motionMode = await Device.findOne({ owner_id: userId, type: 'motion' });
        if (!motionMode) {
            return res.status(404).json({ success: false, message: 'motionMode not found' });
        }
        motionMode.history.push({ value: "on", timestamp: new Date() });
        motionMode.status = "online";
        motionMode.save();
        const blynkUrl = process.env.MOTIONMODE + "1";
        await axios.get(blynkUrl);
        res.status(200).json({
            success: true,
            message: "turnONMotionMode success"
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const turnOFFMotionMode = async (req, res) => {
    try{
        const userId = req.user._id;
        const motionMode = await Device.findOne({ owner_id: userId, type: 'motion' });
        if (!motionMode) {
            return res.status(404).json({ success: false, message: 'motionMode not found' });
        }
        motionMode.history.push({ value: "off", timestamp: new Date() });
        motionMode.status = "offline";
        motionMode.save();
        const blynkUrl = process.env.MOTIONMODE + "0";
        await axios.get(blynkUrl);
        res.status(200).json({
            success: true,
            message: "turnOFFMotionMode success"
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

const fanController = async (req, res) => {
    console.log("fanController");
    try {
        const value = req.params.value;
        const numericValue = parseInt(value, 10);

        if (numericValue < 0 || numericValue > 255) {
            return res.status(400).json({ success: false, message: 'Invalid fan value' });
        }

        const userId = req.user._id;
        const fan = await Device.findOne({ owner_id: userId, type: 'fan' });

        if (!fan) {
            return res.status(404).json({ success: false, message: 'fan not found' });
        }

        const timestamp = new Date();
        fan.history.push({ value, timestamp });
        fan.current_value = value;
        await fan.save();

        const blynkUrl = process.env.FAN + value;
        await axios.get(blynkUrl);

        const io = req.app.get('socketio');
        io.emit('fan:update', { value, timestamp });

        res.status(200).json({ success: true, message: "fan success" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllDevicesHistorySorted = async (req, res) => {
    try {
        const userId = req.user._id;

        const devices = await Device.find({ owner_id: userId });

        let combinedHistory = [];

        devices.forEach(device => {
            const deviceHistory = device.history.map(entry => ({
                device_id: device._id,
                device_name: device.name,
                device_type: device.type,
                value: entry.value,
                timestamp: entry.timestamp
            }));
            combinedHistory.push(...deviceHistory);
        });

        combinedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json({
            success: true,
            history: combinedHistory
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    turnONLed_medium,
    turnONLed_max,
    turnOFFLed,
    turnONAutoLed,
    turnOFFAutoLed,
    turnONMotionMode,
    turnOFFMotionMode,
    fanController,
    getAllDevicesHistorySorted
}