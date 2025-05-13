import React from "react";

const DeviceIcon = ({ name, icon: Icon, brightness = 0, speed = 0 }) => {
  let iconClass = "text-4xl transition-all duration-500 text-gray-500 ";

  if (name === "LED") {
    if (brightness === 0) {
      // OFF
      iconClass += "text-white opacity-30 scale-100";
    } else if (brightness === 50) {
      // MEDIUM
      iconClass += "text-yellow-300 opacity-80 scale-105";
    } else if (brightness === 100 || brightness === 99) {
      // HIGH
      iconClass += "text-yellow-600 opacity-100 scale-110";
    }
  } else if (name === "Fan") {
    speed > 0 
      ? iconClass += "text-white animate-spin-slow"
      : "text-gray-500";
  } else {
    iconClass += "text-white";
  }

  return <Icon className={iconClass} />;
};

export default DeviceIcon;
