const Schedule = require('../models/schedule');
const Device = require('../models/device');
require('dotenv').config();
const axios = require('axios');

const handleSchedule = async (io) => {
    try {
        const now = new Date();
        const schedules = await Schedule.find({ done: false });

        for (const sch of schedules) {
            const scheduledTime = new Date(sch.time);
            if (scheduledTime <= now) {
                console.log(`Đến giờ rồi: ${sch.action}`);

                const [type, valueStr] = sch.action.split('/');
                const value = parseInt(valueStr);
                let blynkUrl = "";

                if (type === 'led') {
                    if (value === 0) {
                        blynkUrl = process.env.LED + "0";
                    } else if (value > 0 && value < 99) {
                        blynkUrl = process.env.LED + value.toString();
                    } else if (value >= 99) {
                        blynkUrl = process.env.LED + "99";
                    }
                } else if (type === 'fan') {
                    if (value >= 0 && value <= 255) {
                        blynkUrl = process.env.FAN + value.toString();
                    } else {
                        console.log("fan value out of range!");
                    }
                } else {
                    console.log("Unknown action type!");
                }

                try {
                    await axios.get(blynkUrl);
                    console.log("Blynk called:", blynkUrl);
                } catch (err) {
                    console.error("Error calling Blynk:", err.message);
                }

                const device = await Device.findById(sch.deviceId);
                if (device) {
                    device.history.push({
                        value: value,
                        timestamp: new Date()
                    });
                    if (device.history.length > 100) {
                        device.history.shift(); 
                    }
                    device.current_value = value.toString();
                    await device.save();

                    io.emit(`${type}:update`, {
                        value: value.toString(),
                        deviceId: device._id.toString()
                    });
                }

                sch.done = true;
                await sch.save();
            }
        }
    } catch (e) {
        console.error("Lỗi trong handleSchedule:", e);
    }
};

const startScheduleLoop = (io) => {
    setInterval(() => handleSchedule(io), 5000);
};

module.exports = startScheduleLoop;
