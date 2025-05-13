"use client";
import Footer from "../../../components/layout/Footer";
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchHumidityData, fetchTemperatureData } from "@/services/deviceService";
import ProtectedRoute from "../../auth/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import LoadingAtom from "../../../utils/LoadingAtom";

export default function Analytics() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
  
    const getData = async () => {
      try {
        const [tempData, humiData] = await Promise.all([
          fetchTemperatureData(token),
          fetchHumidityData(token),
        ]);
  
        setTemperatureData(tempData);
        setHumidityData(humiData);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getData();
  }, []);

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen bg-[#212121] text-white flex flex-col">
        <div className=" flex-1 p-6 md:mt-0">
          {/* Humidity Chart */}
          <div className="bg-[#303030] p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Humidity Over Time</h2>
            {loading ? (<LoadingAtom/>) : (<ResponsiveContainer width="100%" height={250}>
              <LineChart data={humidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#29b6f6"
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>)}
          </div>

          {/* Temperature Chart */}
          <div className="bg-[#303030] p-4 rounded-lg shadow-lg mb-10 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">
              Temperature Over Time
            </h2>
            {loading ? (<LoadingAtom/>) : (<ResponsiveContainer width="100%" height={250}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#fdd835"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>)}
          </div>
        </div>
      </div>
      <Footer/>
    </ProtectedRoute>
  );
}
