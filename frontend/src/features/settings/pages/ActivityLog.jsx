import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import LoadingAtom from "@/utils/LoadingAtom";
import { getDeviceHistoryLogs } from "@/services/deviceService";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const rawLogs = await getDeviceHistoryLogs(token);
  
        const formatted = rawLogs.map((item) => {
          const date = formatDate(item.timestamp);
          const time = formatTime(item.timestamp);
          const device = item.device_name.toUpperCase();
          const value = item.value;
          let action = "";
          let details = "";
  
          switch (device.toLowerCase()) {
            case "fan":
              action = "Fan speed was changed";
              details = `Fan speed was set to ${value} at ${time}.`;
              break;
            case "led":
              action = `LED brightness changed`;
              details = `Brightness was set to ${value} lux at ${time}.`;
              break;
            case "temperature":
              action = `Temperature reading updated`;
              details = `Temperature was recorded as ${value}°C at ${time}.`;
              break;
            case "humidity":
              action = `Humidity reading updated`;
              details = `Humidity was recorded as ${value}% at ${time}.`;
              break;
            default:
              action = `${device} set to ${value}`;
              details = `Value was set to ${value} at ${time}.`;
          }
  
          return {
            date,
            device,
            action,
            details,
          };
        });
  
        setLogs(formatted);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLogs();
  }, []);
  

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
        <FaHistory /> Activity Log
      </h2>
      <div className="relative border-l border-gray-700 ml-4 space-y-4 max-h-[678px] overflow-y-auto p-2 scrollbar-hidden">
        {loading ? (
          <LoadingAtom/> 
        ) : (
          logs.map((item, index) => (
            <div key={index} className="ml-6 relative">
              <div className="absolute -left-2 w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="bg-gray-700 p-3 rounded-md shadow-md">
                <p className="text-sm text-gray-400">{item.date}</p>
                <p className="text-base font-semibold text-blue-400">{item.device}</p>
                <p className="text-base">{item.action}</p>
                <div className="text-sm text-gray-300">{item.details}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
