"use client";
import React, { useEffect } from "react";
import { controlLEDBrightness } from "../../../services/deviceService";
import socket from "@/socket"; // giống như bạn làm ở TemperatureControl

const LedControl = ({ brightness, setBrightness, token }) => {
  const sendBrightnessLevel = async (level) => {
    await controlLEDBrightness(level, token);
  };

  // Gửi brightness mỗi khi thay đổi từ slider
  useEffect(() => {
    sendBrightnessLevel(brightness);
  }, [brightness]);

  // Lắng nghe từ socket: backend tự cập nhật LED
  useEffect(() => {
    socket.on("led:update", (data) => {
      console.log("LED update từ socket:", data);
      const parsedValue = parseInt(data.value); 
      if (!isNaN(parsedValue)) {
        setBrightness(parsedValue);
      }
    });

    return () => {
      socket.off("led:update");
    };
  }, []);

  const brightnessLabel = {
    0: "OFF",
    50: "MEDIUM",
    99: "HIGH",
  };

  const levels = [0, 50, 99];

  const getButtonClass = (level) => {
    if (parseInt(brightness) === level) {
      switch (level) {
        case 0:
          return "bg-gray-400 text-white";
        case 50:
          return "bg-yellow-200 text-white";
        case 99:
          return "bg-yellow-300 text-white";
        default:
          return "bg-white text-gray-700 hover:bg-gray-100";
      }
    }
    return "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer";
  };

  return (
    <div className="mt-2">
      <div className="inline-flex w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm">
        {levels.map((level, index) => (
          <button
            key={level}
            onClick={() => setBrightness(level)}
            className={`flex-1 py-1 text-xs font-medium transition-all duration-150
              ${getButtonClass(level)}
              ${index !== levels.length - 1 ? "border-r border-gray-300" : ""}`}
          >
            {brightnessLabel[level]}
          </button>
        ))}
      </div>

      <p className="text-xs mt-2 text-gray-400">
        Current: {brightnessLabel[brightness]}
      </p>
    </div>
  );
};

export default LedControl;