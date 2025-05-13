import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const AlertMessage = ({ alertMsg }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (alertMsg) setIsVisible(true);
  }, [alertMsg]);

  const handleCloseAlert = () => {
    setIsVisible(false);
  };

  if (!isVisible || !alertMsg) return null;

  return (
    <div className="relative bg-yellow-100 text-red-600 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-sm border-l-4 border-yellow-500 mb-2 sm:mb-3">
      {/* Nút đóng */}
      <button
        onClick={handleCloseAlert}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors p-1 rounded-full"
        aria-label="Close"
      >
        <X size={14} className="sm:w-4 sm:h-4" />
      </button>

      {/* Nội dung */}
      <p className="text-xs sm:text-sm font-medium whitespace-pre-line pr-6 sm:pr-8">
        {alertMsg}
      </p>
    </div>
  );
};

export default AlertMessage;