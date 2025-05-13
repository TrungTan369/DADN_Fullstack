"use client";
import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingAtom = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-6">
      <FaSpinner className="animate-spin text-white text-3xl" />
    </div>
  );
};

export default LoadingAtom;
