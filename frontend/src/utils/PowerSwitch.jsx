import React from "react";

const PowerSwitch = ({ isOn, togglePower }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={isOn}
      onChange={togglePower}
      className="sr-only peer"
    />
    <div
      className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer
      peer-checked:bg-green-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white 
      after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"
    ></div>
  </label>
);

export default PowerSwitch;
