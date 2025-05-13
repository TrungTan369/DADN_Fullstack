import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ActionTimeline from "@/utils/ActionTimeline";
import { getAllSchedules } from "@/services/deviceService";
import LoadingAtom from "@/utils/LoadingAtom";
import toast from "react-hot-toast";
import SelectBox from "@/utils/SelectBox";

export function SetTime() {
  const [devices] = useState(["Fan", "LED"]);
  const [selectedDevice, setSelectedDevice] = useState("Fan");
  const [timer, setTimer] = useState("");
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [fanValue, setFanValue] = useState(0);
  const [ledValue, setLedValue] = useState("OFF");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  dayjs.extend(utc);

  const fetchScheduledTimes = async () => {
    try {
      const data = await getAllSchedules(token);
      setScheduledTimes(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledTimes();
  }, []);

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const now = new Date();

    const [hours, minutes] = selectedTime.split(":").map(Number);

    const scheduledDate = new Date(now);
    scheduledDate.setHours(hours);
    scheduledDate.setMinutes(minutes);
    scheduledDate.setSeconds(0);
    scheduledDate.setMilliseconds(0);

    if (
      hours < now.getHours() ||
      (hours === now.getHours() && minutes <= now.getMinutes())
    ) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const utcISOString = dayjs(scheduledDate).utc().toISOString();

    setTimer(utcISOString);
  };

  const handleSetTimer = async () => {
    const scheduleData = {
      time: timer,
      value:
        selectedDevice === "Fan"
          ? fanValue
          : ledValue === "OFF"
          ? 0
          : ledValue === "MEDIUM"
          ? 50
          : 99,
    };
    console.log("scheduleData to send:", scheduleData);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        selectedDevice === "Fan"
          ? "http://localhost:5000/api/schedules/createFanSchedule"
          : "http://localhost:5000/api/schedules/createLedSchedule",
        scheduleData,
        config
      );

      if (response.data.success) {
        toast.success("Set schedule success!");
        await fetchScheduledTimes();
      }
    } catch (error) {
      toast.error("Failed!");
      console.error("Error setting timer:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 flex-wrap">
      {/* Left Side: Device Selection and Timer Setup */}
      <div className="bg-[#303030] rounded-xl p-4 shadow w-full sm:w-[48%]">
        <h2 className="text-xl font-semibold mb-4">Set Device Timer</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <SelectBox
              label="Select Device"
              value={selectedDevice}
              onChange={setSelectedDevice}
              options={devices}
            />

            {selectedDevice === "Fan" ? (
              <div className="flex-1">
                <label htmlFor="fanValue" className="block mb-1">
                  Set Fan (0-255)
                </label>
                <input
                  type="number"
                  id="fanValue"
                  className="w-full p-1.5 rounded bg-gray-600 text-white border border-white"
                  value={fanValue}
                  min={0}
                  max={255}
                  onChange={(e) => setFanValue(e.target.value)}
                />
              </div>
            ) : (
              <SelectBox
                label="Set LED Value"
                value={ledValue}
                onChange={setLedValue}
                options={["OFF", "MEDIUM", "HIGH"]}
              />
            )}
          </div>

          <div>
            <label htmlFor="timerInput" className="block mb-1">
              Set Time
            </label>
            <input
              type="time"
              id="timerInput"
              className="w-full py-2 rounded bg-gray-600 text-white border border-white"
              value={timer ? dayjs(timer).local().format("HH:mm") : ""}
              onChange={handleTimeChange}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white mt-2 w-full"
            onClick={handleSetTimer}
          >
            Set Timer
          </button>
        </div>
      </div>

      {/* Right Side: Display Scheduled Times */}
      <div className="bg-[#303030] rounded-xl p-4 shadow w-full sm:w-[48%]">
        <h2 className="text-xl font-semibold mb-4">Scheduled Times</h2>
        <div className="max-h-[200px] overflow-y-auto scrollbar-hidden">
          {loading ? (
            <LoadingAtom />
          ) : (
            <ActionTimeline scheduledTimes={scheduledTimes} />
          )}
        </div>
      </div>
    </div>
  );
}