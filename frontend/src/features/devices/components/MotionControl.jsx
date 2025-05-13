"use client";
import { useState, useEffect } from "react";
import { FaDoorOpen } from "react-icons/fa";
import { turnOnMotionMode, turnOffMotionMode } from "../../../services/deviceService";
import toast from "react-hot-toast";
import PowerSwitch from "../../../utils/PowerSwitch";

export function MotionControl({ token }) {
  const [motionStatus, setMotionStatus] = useState("offline");

  const toggleMotion = async () => {
    try {
      if (motionStatus === "online") {
        await turnOffMotionMode(token);
        setMotionStatus("offline");
      } else {
        await turnOnMotionMode(token);
        setMotionStatus("online");
      }
    } catch (err) {
      toast.error("Failed to toggle motion mode");
      console.error("Motion toggle error:", err.message);
    }
  };

  return (
    <div className="bg-[#303030] rounded-xl p-4 shadow flex items-center justify-between ">
      <div className="flex items-center gap-4">
        {/* Text content */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Motion Mode</h2>
          <p className="text-sm text-gray-400">
            Real-time monitoring of auto led status
          </p>
        </div>
      </div>

      {/* Toggle Motion Button */}
      <PowerSwitch
        isOn={motionStatus === "online"}
        togglePower={toggleMotion}
      />
    </div>
  );
}
