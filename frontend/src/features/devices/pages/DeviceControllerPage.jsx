"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaThermometerHalf,
  FaLightbulb,
  FaTint,
  FaClock,
} from "react-icons/fa";
import { PiFanFill } from "react-icons/pi";
import DeviceCard from "../components/DeviceCard";
import Header from "../../../components/layout/Header";
import { MotionControl } from "../components/MotionControl";
import { SetTime } from "../components/SetTime";
import ProtectedRoute from "../../auth/components/ProtectedRoute";
import Footer from "../../../components/layout/Footer";
import AlertMessage from "@/utils/AlertMessage";
import styles from "../styles/CustomScrollbar.module.css"; // Import CSS module

const deviceList = [
  {
    icon: FaLightbulb,
    name: "LED",
    description: "In living-room",
  },
  {
    icon: PiFanFill,
    name: "Fan",
    description: "Adjust rotation speed.",
  },
  {
    icon: FaThermometerHalf,
    name: "Temperature",
    description: "Adjust temperature.",
  },
  {
    icon: FaTint,
    name: "Humidity",
    description: "Moisture level in the air",
  },
];

export default function DeviceController() {
  const [token, setToken] = useState(null);
  const [time, setTime] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [temperatureWarnings, setTemperatureWarnings] = useState([]);
  const [humidityWarnings, setHumidityWarnings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/");
    } else {
      setToken(storedToken);
    }
    const interval = setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen bg-[#212121] text-white flex flex-col">
        <div className=" flex-1 p-6 md:mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative rounded-xl overflow-hidden bg-[#0a0c2c]">
              <Image
                src="/living-room.jpg"
                alt="Living room"
                width={800}
                height={500}
                className="w-full object-cover"
              />
              {isClient && time && (
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl shadow text-right text-white text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <span>
                      <FaClock size={22} />
                    </span>
                    <div>
                      <div className="text-lg font-semibold leading-tight">
                        {time.toLocaleTimeString()}
                      </div>
                      <div className="text-xs opacity-75">
                        {time.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {deviceList.map((device, index) => (
                <DeviceCard
                  key={index}
                  icon={device.icon}
                  name={device.name}
                  description={device.description}
                  token={token}
                  setTemperatureWarnings={
                    device.name === "Temperature" ? setTemperatureWarnings : undefined
                  }
                  setHumidityWarnings={
                    device.name === "Humidity" ? setHumidityWarnings : undefined
                  }
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-10 md:mb-0">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <SetTime />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
              
              <div className="bg-[#2a2a2a] rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-2">Warnings</h3>
                <div className={`max-h-30 overflow-y-auto ${styles.customScrollbar}`}>
                  {temperatureWarnings.concat(humidityWarnings).length > 0 ? (
                    temperatureWarnings.concat(humidityWarnings).map((warning, index) => (
                      <AlertMessage key={index} alertMsg={warning} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No warnings at the moment.</p>
                  )}
                </div>
              </div>

              <MotionControl token={token} />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </ProtectedRoute>
  );
}