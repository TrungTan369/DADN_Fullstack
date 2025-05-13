import React, { useState, useEffect } from "react";
import DeviceIcon from "./DeviceIcon";
import FanControl from "./FanControl";
import TemperatureControl from "./TemperatureControl";
import HumidityControl from "./HumidityControl";
import LedControl from "./LedControl";
import { getLastUsedDevices } from "@/services/authService";
import LoadingAtom from "@/utils/LoadingAtom";

const DeviceCard = ({ icon: Icon, name, description, token, setTemperatureWarnings, setHumidityWarnings }) => {
  const [speed, setSpeed] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await getLastUsedDevices(token);
        const data = response.data;

        if (name === "Fan" && data.fan?.current_value) {
          setSpeed(parseInt(data.fan.current_value));
        }

        if (name === "LED" && data.led?.current_value) {
          setBrightness(parseInt(data.led.current_value));
        }

        if (name === "LED" && data.autoled?.status) {
          setAutoMode(data.autoled.status !== "offline");
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch device data:", error);
      }
    };

    fetchDeviceData();
  }, [name, token]);

  const renderScale = (steps, min, max) =>
    Array.from({ length: steps + 1 }).map((_, i) => {
      const percent = (i / steps) * 100;
      const value = Math.round(min + ((max - min) * i) / steps);
      return (
        <div
          key={i}
          className="absolute top-full text-[10px] text-gray-300"
          style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
        >
          {value}
        </div>
      );
    });

  return (
    <div className="bg-[#303030] p-4 rounded-lg shadow-lg text-sm md:text-base text-white relative">
      <div className="flex justify-between items-center mb-3">
        <DeviceIcon
          icon={Icon}
          name={name}
          brightness={brightness}
          speed={speed}
        />
      </div>

      <p className="text-lg font-semibold">{name}</p>
      <p className="text-xs md:text-sm text-gray-400">{description}</p>

      {name === "Fan" &&
        (loading ? (
          <LoadingAtom />
        ) : (
          <FanControl speed={speed} setSpeed={setSpeed} token={token} />
        ))}
      {name === "Temperature" && (
        <TemperatureControl
          renderScale={renderScale}
          token={token}
          setWarnings={setTemperatureWarnings}
        />
      )}
      {name === "Humidity" && (
        <HumidityControl
          renderScale={renderScale}
          token={token}
          setWarnings={setHumidityWarnings} // Truyền setHumidityWarnings dưới tên setWarnings
        />
      )}
      {name === "LED" &&
        (loading ? (
          <LoadingAtom />
        ) : (
          <LedControl
            brightness={brightness}
            setBrightness={setBrightness}
            autoMode={autoMode}
            setAutoMode={setAutoMode}
            token={token}
          />
        ))}
    </div>
  );
};

export default DeviceCard;