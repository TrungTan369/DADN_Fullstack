"use client";
import React, { useEffect } from "react";
import { setFanSpeed } from "../../../services/deviceService";
import socket from "@/socket"; // Giả sử socket đã được cấu hình ở đây

const FanControl = ({ speed, setSpeed, token }) => {
  const handleSpeedChange = async (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);

    try {
      await setFanSpeed(newSpeed, token); // Gửi tốc độ quạt mới lên API
    } catch (err) {
      console.error("Failed to update fan speed:", err.message);
    }
  };

  useEffect(() => {
    socket.on("fan:update", (data) => {
      console.log("Fan speed update từ socket:", data);
      
      const parsedValue = parseInt(data.value); // Ép kiểu string -> number
      if (!isNaN(parsedValue)) {
        setSpeed(parsedValue);
      }
    });

    return () => {
      socket.off("fan:update"); // Hủy lắng nghe sự kiện khi component bị hủy
    };
  }, []);

  return (
    <div className="mt-3">
      <input
        type="range"
        min="0"
        max="255"
        value={speed}
        onChange={handleSpeedChange}
        className="w-full cursor-pointer"
        step={1}
      />
      <p className="text-xs mt-1 text-gray-400">Speed: {speed}</p>
    </div>
  );
};

export default FanControl;
