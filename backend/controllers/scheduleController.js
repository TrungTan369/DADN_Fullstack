const Device = require('../models/device');
const Schedule = require('../models/schedule');

const createLedSchedule = async (req,res) => {
    console.log("createLedSchedule")
    try{
        const userId = req.user._id;
        const led = await Device.findOne({ owner_id: userId, type: 'led' });
        if (!led) {
            return res.status(404).json({ success: false, message: 'LED not found' });
        }
        
        const {time, value} = req.body;
        const taskTime = new Date(time);
        if (isNaN(taskTime.getTime())) {
            return res.status(400).json({ error: 'Time không hợp lệ. Phải là thời gian hợp lệ ISO hoặc yyyy-mm-dd hh:mm' });
        }
        const now = new Date();
        if (taskTime < now) {
            return res.status(400).json({ error: 'Time phải là thời điểm trong tương lai' });
        }

        const schedule = new Schedule({
            action: "led/" + value,
            time: time,
            deviceId: led._id,
        });
        await schedule.save()

        res.status(200).json({
            success: true,
            message: "createLedSchedule success"
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const createFanSchedule = async (req,res) => {
    console.log("createFanSchedule")
    try{
        const userId = req.user._id;
        const fan = await Device.findOne({ owner_id: userId, type: 'fan' });
        if (!fan) {
            return res.status(404).json({ success: false, message: 'fan not found' });
        }
        
        const {time, value} = req.body;
        const taskTime = new Date(time);
        if (isNaN(taskTime.getTime())) {
            return res.status(400).json({ error: 'Time không hợp lệ. Phải là thời gian hợp lệ ISO hoặc yyyy-mm-dd hh:mm' });
        }
        const now = new Date();
        if (taskTime < now) {
            return res.status(400).json({ error: 'Time phải là thời điểm trong tương lai' });
        }

        const schedule = new Schedule({
            action: "fan/" + value,
            time: time,
            deviceId: fan._id,
        });
        await schedule.save()

        res.status(200).json({
            success: true,
            message: "createFanSchedule success"
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const deleteSchedule = async (req,res) => {
    console.log("deleteSchedule")
    try{
        const scheduleId = req.params.scheduleId;
        const schedule = await Schedule.findOne({ _id: scheduleId});
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }
        
        await Schedule.deleteOne({ _id: scheduleId });

        res.status(200).json({
            success: true,
            message: "deleteSchedule success"
        })
    }catch(error)
    {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getSchedules = async (req, res) => {
    // console.log("getSchedules");
    try {
        const userId = req.user._id;

        const devices = await Device.find({ owner_id: userId });
        const deviceIds = devices.map(device => device._id);

        const schedules = await Schedule.find({
            deviceId: { $in: deviceIds },
            done: false
        }).sort({ time: 1 });

        res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    createLedSchedule,
    createFanSchedule,
    deleteSchedule,
    getSchedules
}