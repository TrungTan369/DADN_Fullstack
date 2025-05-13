// components/Header.js
"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaThLarge, FaChartLine, FaCog, FaSignOutAlt } from "react-icons/fa";
import MobileHeader from "./MobileHeader";

const navItems = [
  { path: "/device-controller", name: "Home", icon: FaThLarge },
  { path: "/analytics", name: "Analytics", icon: FaChartLine },
  { path: "/setting", name: "Setting", icon: FaCog },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-black text-white px-4 md:px-10 py-5 shadow-md border-b-2 border-[#171717]">
        <nav className="flex items-center justify-center gap-12">
          {navItems.map(({ path, name, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <div
                key={path}
                onClick={() => router.push(path)}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  isActive ? "text-green-400" : "text-gray-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={20} />
                  <span className="text-base font-medium">{name}</span>
                </div>
                {isActive && (
                  <div className="w-full h-[2px] bg-green-400 mt-1 rounded-full" />
                )}
              </div>
            );
          })}

          <div
            onClick={handleLogout}
            className="flex flex-col items-center cursor-pointer text-gray-300 hover:text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <FaSignOutAlt size={20} />
              <span className="text-base font-medium">Log Out</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileHeader/>
    </>
  );
};

export default Header;
