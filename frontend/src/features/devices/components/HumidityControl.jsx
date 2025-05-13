"use client";
import React, { useEffect, useState } from "react";
import { FaWind } from "react-icons/fa";
import { updateHumidity, getHumidity } from "../../../services/deviceService";
import socket from "@/socket";

const HumidityControl = ({ renderScale, token, setWarnings }) => {
  const [humidity, setHumidity] = useState(50);

  useEffect(() => {
    const fetchHumidity = async () => {
      try {
        const value = await getHumidity(token);
        setHumidity(value);
        const response = await updateHumidity(value, token);
        if (response?.warnings?.length > 0) {
          setWarnings(response.warnings);
        } else {
          setWarnings([]);
        }
      } catch (err) {
        console.error("Failed to fetch humidity:", err);
      }
    };
  
    fetchHumidity();
    const interval = setInterval(fetchHumidity, 5000);
    return () => clearInterval(interval);

    // socket.on("humidity:update", (data) => {
    //   console.log("Socket received:", data);
    //   setHumidity(data.value);
    //   if (data.warnings?.length > 0) {
    //     setWarnings(data.warnings);
    //   } else {
    //     setWarnings([]);
    //   }
    // });

    // return () => {
    //   socket.off("humidity:update");
    // };
  }, [token, setWarnings]);

  return (
    <div className="mt-4">
      <div className="relative w-full h-6 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{
            width: `${humidity}%`,
            background: "linear-gradient(to right, #b3e5fc, #4fc3f7, #0288d1)",
            borderRadius: "9999px",
          }}
        ></div>
        <FaWind className="absolute right-1 top-1/2 -translate-y-1/2 text-white text-xs" />
        <div className="absolute w-full left-0 flex justify-between text-[10px] text-gray-300 px-1">
          {renderScale(4, 0, 100)}
        </div>
      </div>
      <p className="text-xs mt-1 text-gray-400">{humidity}%</p>
    </div>
  );
};

export default HumidityControl;