"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaThLarge, FaChartLine, FaCog, FaBell, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { path: "/device-controller", icon: FaThLarge },
  { path: "/analytics", icon: FaChartLine },
  { path: "/setting", icon: FaCog },
];

const MobileHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md flex justify-around py-2">
        {navItems.map(({ path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <div
              key={path}
              onClick={() => router.push(path)}
              className={`flex flex-col items-center justify-center text-xs cursor-pointer ${
                isActive ? "text-black" : "text-gray-400"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  isActive ? "bg-black text-white" : ""
                }`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}

        {/* Logout Icon */}
        <div
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-xs cursor-pointer text-gray-400"
        >
          <div className="p-2 rounded-full hover:bg-red-100">
            <FaSignOutAlt size={22} />
          </div>
        </div>
      </nav>

    </>
  );
};

export default MobileHeader;
