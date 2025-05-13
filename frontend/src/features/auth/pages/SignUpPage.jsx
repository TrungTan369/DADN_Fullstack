"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerUser } from "../../../services/authService";

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      toast.success("Sign up successful!");
      router.push("/");
    } catch (error) {
      toast.error("Sign up failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-300 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/home.jpg')" }}
      />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-3xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="text-gray-500 text-sm mb-6">
            Welcome to S-Home Website - Let's create your account
          </p>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-600 text-sm font-bold">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded mt-1"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-bold">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded mt-1"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-bold">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded mt-1"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700"
            >
              Sign up
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/" className="text-black font-medium">
              Log in
            </a>
          </p>
        </div>

        <div className="w-full md:w-1/2 hidden md:flex justify-center items-center p-3">
          <img
            src="/smarthome.jpg"
            alt="Banner"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
