require('dotenv').config();
const axios = require('axios');
const Sensor = require('../models/sensor')

const updateTempValue = async (req,res) => {
    try{
        const userId = req.user._id;
        const item = await Sensor.findOne({ owner_id: userId, type: 'temperature' });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Temp not found' });
        }

        const { value } = req.body;
        const timestamp = new Date();

        ///////////////////////////
        const MAX_JUMP = 5;
        const THRESHOLD_TEMP = 35;
        let warnings = [];


        // Kiểm tra nếu vượt ngưỡng
        if (value > THRESHOLD_TEMP) {
            warnings.push(`Temperature ${value}°C exceeds the allowed limit (${THRESHOLD_TEMP}°C)`);

        }

        // Kiểm tra thay đổi đột ngột
        const lastValue = item.value.length > 0 ? item.value[item.value.length - 1].value : null;
        if (lastValue !== null && Math.abs(value - lastValue) > MAX_JUMP) {
            warnings.push(`Sudden temperature change detected: from ${lastValue}°C to ${value}°C (maximum allowed change is ${MAX_JUMP}°C)`);

        }

        /////////////////////////

        item.value.push({ value, timestamp });
        await item.save();

        const blynkUrl = process.env.TEMPERATURE_UPDATE + value;
        await axios.get(blynkUrl);

        // Emit sự kiện đến tất cả client
        const io = req.app.get('socketio');
        io.emit('temp:update', { value, timestamp, warnings });

        res.status(200).json({
            success: true,
            message: "updateTempValue success",
            warnings
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getTempValue = async (req,res) => {
    try{
        const userId = req.user._id;
        const item = await Sensor.findOne({ owner_id: userId, type: 'temperature' });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Temp not found' });
        }
        const blynkUrl = process.env.TEMPERATURE_GET;
        const tempValue = await axios.get(blynkUrl);
        console.log(tempValue.data);
        res.status(200).json({
            success: true,
            value: tempValue.data
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const updateHumiValue = async (req,res) => {
    try{
        const userId = req.user._id;
        const item = await Sensor.findOne({ owner_id: userId, type: 'humidity' });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Humi not found' });
        }

        const { value } = req.body;
        const timestamp = new Date();

        //////////////////////////////
        const THRESHOLD_HUMI = 90; 
        const MAX_JUMP = 10;     
        let warnings = [];
  

        if (value > THRESHOLD_HUMI) {
            warnings.push(`Humidity ${value}% exceeds the allowed limit (${THRESHOLD_HUMI}%)`);
        }

        const lastValue = item.value.length > 0 ? item.value[item.value.length - 1].value : null;
        if (lastValue !== null && Math.abs(value - lastValue) > MAX_JUMP) {
            warnings.push(`Sudden humidity change detected: from ${lastValue}% to ${value}% (maximum allowed change is ${MAX_JUMP}%)`);
        }
        //////////////////////////////

        item.value.push({ value, timestamp });
        await item.save();

        const blynkUrl = process.env.HUMI_UPDATE + value;
        await axios.get(blynkUrl);

        // Emit sự kiện đến tất cả client
        const io = req.app.get('socketio');
        io.emit('humidity:update', { value, timestamp, warnings });

        res.status(200).json({
            success: true,
            message: "updateHumiValue success",
            warnings
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getHumiValue = async (req,res) => {
    try{
        const userId = req.user._id;
        const item = await Sensor.findOne({ owner_id: userId, type: 'humidity' });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Humi not found' });
        }
        const blynkUrl = process.env.HUMI_GET;
        const humiValue = await axios.get(blynkUrl);
        res.status(200).json({
            success: true,
            value: humiValue.data
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getALLTempValue = async (req, res) => {
    try {
        const userId = req.user._id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); 

        const item = await Sensor.findOne({
            owner_id: userId,
            type: 'temperature',
            'value.timestamp': { $gte: startOfDay, $lte: endOfDay } 
        });

        if (!item) {
            return res.status(404).json({ success: false, message: 'Temp not found for today' });
        }

        res.status(200).json({
            success: true,
            values: item.value
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getALLHumiValue = async (req,res) => {
    try{
        const userId = req.user._id;
        const item = await Sensor.findOne({ owner_id: userId, type: 'humidity' });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Humi not found' });
        }
        res.status(200).json({
            success: true,
            value: item.value
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = {
    updateTempValue,
    getTempValue,
    updateHumiValue,
    getHumiValue,
    getALLTempValue,
    getALLHumiValue
}