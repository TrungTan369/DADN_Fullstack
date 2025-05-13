require("dotenv").config();
const axios = require("axios");
const User = require("../models/user");
const Device = require("../models/device");
const Sensor = require("../models/sensor");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async(req,res) => {
    const { username, email, password} = req.body;
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bycrypt.hash(password, 12);
    try{
        console.log("username: ", username);
        console.log("email: ", email);

        const user = new User({
            username,
            email,
            password: hashedPassword
        })
        const led = new Device({
            name: "led",
            type: "led",
            owner_id: user._id,
            status: "offline",
            registered_at: Date.now()
        });
        const autoled = new Device({
            name: "autoled",
            type: "autoled",
            owner_id: user._id,
            status: "offline",
            registered_at: Date.now()
        });
        const fan = new Device({
            name: "fan",
            type: "fan",
            owner_id: user._id,
            status: "offline",
            registered_at: Date.now()
        });
        const motionSensor = new Device({
            name: "motionSensor",
            type: "motion",
            owner_id: user._id,
            status: "offline",
            registered_at: Date.now()
        });
        const temperatureSensor = new Sensor({
            name: "temperatureSensor",
            type: "temperature",
            owner_id: user._id,
            registered_at: Date.now()
        });
        const humiditySensor = new Sensor({
            name: "humiditySensor",
            type: "humidity",
            owner_id: user._id,
            registered_at: Date.now()
        });

        await autoled.save();
        await led.save();
        await fan.save();
        await motionSensor.save();
        await temperatureSensor.save();
        await humiditySensor.save();
        console.log(temperatureSensor);
        

        await user.save();
        return res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const loginUser = async(req,res) => {
    const { username,password} = req.body;
    const existingUser = await User.findOne({ username });

    if (
        !existingUser ||
        !(await bycrypt.compare(password, existingUser.password))
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
    }
    const accessToken = jwt.sign(
        {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "360m" }
    );
    const led = await Device.findOne({ owner_id: existingUser._id, type: 'led' });
    const autoled = await Device.findOne({ owner_id: existingUser._id, type: 'autoled' });
    const fan = await Device.findOne({ owner_id: existingUser._id, type: 'fan' });
    const motionSensor = await Device.findOne({ owner_id: existingUser._id, type: 'motion' });
    const temperatureSensor = await Sensor.findOne({ owner_id: existingUser._id, type: 'temperature' });
    const humiditySensor = await Sensor.findOne({ owner_id: existingUser._id, type: 'humidity' });
    console.log("temp val: ",temperatureSensor.value.length)
    let temperature_value = 0;
    if(temperatureSensor.value.length == 0){
        temperature_value = 0;
    }
    let humidity_value = 0;
    if(humiditySensor.value.length == 0){
        humidity_value = 0;
    }
    try {
        // await axios.get(process.env.LED + led.current_value);
        // if (autoled.status === "online") {
        //     await axios.get(process.env.AUTOLED + "1");
        // }else {
        //     await axios.get(process.env.AUTOLED + "0");
        // }
        // if (motionSensor.status === "online") {
        //     await axios.get(process.env.MOTIONMODE + "1");
        // } else {
        //     await axios.get(process.env.MOTIONMODE + "0");
        // }
        // await axios.get(process.env.FAN + fan.current_value);
        // await axios.get(process.env.TEMPERATURE_UPDATE + temperature_value);
        // await axios.get(process.env.HUMI_UPDATE + humidity_value);
        console.log("init blynk after login success"); 
    } catch (err) {
        console.error("Error calling Blynk:", err.message);
        return res.status(500).json({ success: false, message: "Failed to trigger Blynk" });
    }
    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken,
            led: led.current_value,
            autoled: autoled.status,
            fan: fan.current_value,
            motionSensor: motionSensor.status,
            temperatureSensor: temperatureSensor.value,
            humiditySensor: humiditySensor.value
        },
      });
}
const profile  = async(req,res) => {
    const user_id = req.user._id;
    const existingUser = await User.findById(user_id)
    if(!existingUser){
        res.status(404).json({
            success: false,
            message: "no user found"
        })
    }else{
        res.status(200).json({
            success: true,
            user: existingUser
        })
    }
}

const changePassword = async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bycrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const hashedNewPassword = await bycrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getLastUsedDevices = async (req, res) => {
    const user_id = req.user._id;

    try {
        const led = await Device.findOne({ owner_id: user_id, type: 'led' });
        const autoled = await Device.findOne({ owner_id: user_id, type: 'autoled' });
        const fan = await Device.findOne({ owner_id: user_id, type: 'fan' });
        const motionSensor = await Device.findOne({ owner_id: user_id, type: 'motion' });

        res.status(200).json({
            success: true,
            data: {
                led: {
                    current_value: led?.current_value || "N/A", 
                },
                autoled: {
                    status: autoled?.status || "N/A",
                },
                fan: {
                    current_value: fan?.current_value || "N/A",
                },
                motionSensor: {
                    status: motionSensor?.status || "N/A",
                },
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch device data" });
    }
};



module.exports = {
    loginUser,
    registerUser,
    profile,
    changePassword,
    getLastUsedDevices
}