import React from "react";
import { FaHeadset, FaRegPaperPlane, FaMinus } from "react-icons/fa";

const ContactBox = () => {
  return (
    <div className="hidden md:block bg-[#303030] p-4 rounded-lg shadow-lg">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
        <FaHeadset /> Contact
      </h2>
      <div className="h-32 bg-gray-600 p-3 rounded-md overflow-y-auto"></div>
      <div className="mt-3 flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-600 rounded-md border border-gray-600"
        />
        <button className="ml-2 bg-blue-500 p-2 rounded-md hover:bg-blue-600">
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  );
}

const MobileContactPopup = ({ isOpen, closePopup }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gray-800 p-4 rounded-lg w-3/4 z-50">
        <button className="float-right text-white" onClick={closePopup}>
          <FaMinus />
        </button>
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <FaHeadset /> Contact
        </h2>
        <div className="h-64 bg-gray-700 p-3 rounded-md overflow-y-auto"></div>
        <div className="mt-3 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 rounded-md border border-gray-600"
          />
          <button className="ml-2 bg-blue-500 p-2 rounded-md hover:bg-blue-600">
            <FaRegPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export {ContactBox, MobileContactPopup};