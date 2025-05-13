"use client";
import axios from "axios";
import React from "react";

const BASE_URL = "http://localhost:5000";

// Update temperature
const updateTemperature = async (value, token) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/sensors/temp/update`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to update temperature:", err);
  }
};

// Update humidity
const updateHumidity = async (value, token) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/sensors/humi/update`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to update humidity:", err);
  }
};

// Get all schedules
const getAllSchedules = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/schedules/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch schedules:", err);
    return [];
  }
};

// Turn ON motion mode
const turnOnMotionMode = async (token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/devices/turnONmotionMode`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to turn ON motion mode:", err);
  }
};

// Turn OFF motion mode
const turnOffMotionMode = async (token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/devices/turnOFFmotionMode`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to turn OFF motion mode:", err);
  }
};

// Control LED brightness
const controlLEDBrightness = async (level, token) => {
  let url = "";
  if (level === 0) {
    url = `${BASE_URL}/api/devices/turnOFFled`;
  } else if (level === 50) {
    url = `${BASE_URL}/api/devices/turnONled_medium`;
  } else if (level === 100 || level === 99) {
    url = `${BASE_URL}/api/devices/turnONled_high`;
  } else {
    console.warn("Invalid LED brightness level:", level);
    return;
  }

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to control LED brightness:", err);
  }
};

// Toggle Auto LED mode
const toggleAutoLed = async (autoMode, token) => {
  const url = autoMode
    ? `${BASE_URL}/api/devices/turnONautoLed`
    : `${BASE_URL}/api/devices/turnOFFautoLed`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Error:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error in Auto LED API call:", error);
    return null;
  }
};

const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

const getDeviceHistoryLogs = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/devices/history/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.history;
  } catch (error) {
    console.error("Failed to fetch device history logs:", error);
    throw error;
  }
};

const setFanSpeed = async (speed, token) => {
  try {
    await axios.post(
      `${BASE_URL}/api/devices/fan/${speed}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update fan speed:", error.message);
    throw error;
  }
};

const getHumidity = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/sensors/humi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data?.value ?? 50;
  } catch (error) {
    console.error("Failed to fetch humidity:", error);
    throw error;
  }
};

const getTemperature = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/sensors/temp`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data?.value ?? 24;
  } catch (error) {
    console.error("Failed to fetch temperature:", error);
    throw error;
  }
};

export const fetchTemperatureData = async (token) => {
  const response = await axios.get(`${BASE_URL}/api/sensors/temp/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.success) {
    return response.data.values.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: item.value,
    }));
  }

  throw new Error("Failed to fetch temperature data");
};

export const fetchHumidityData = async (token) => {
  const response = await axios.get(`${BASE_URL}/api/sensors/humi/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.success) {
    return response.data.value.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      humidity: item.value,
    }));
  }

  throw new Error("Failed to fetch humidity data");
};

export {
  updateTemperature,
  updateHumidity,
  getAllSchedules,
  turnOnMotionMode,
  turnOffMotionMode,
  controlLEDBrightness,
  toggleAutoLed,
  getUserProfile,
  getDeviceHistoryLogs,
  setFanSpeed,
  getHumidity,
  getTemperature
};
