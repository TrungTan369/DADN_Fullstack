"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import ActivityLog from "./ActivityLog";
import ProfileForm from "@/features/settings/pages/ProfileForm";
import { ContactBox, MobileContactPopup } from "@/features/settings/pages/Contact";
import { FaHeadset } from "react-icons/fa";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import Footer from "@/components/layout/Footer";

export default function Setting() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen bg-[#212121] text-white flex">
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 bg-[#303030] p-4 rounded-lg shadow-lg">
              <ActivityLog />
            </div>
            <div className="md:w-1/2 flex flex-col gap-6 h-auto md:mb-0 mb-10">
              <ProfileForm />
              <ContactBox />
            </div>
          </div>
          <button
            className="fixed bottom-6 right-6 md:hidden bg-green-700 p-4 rounded-full md:mb-0 mb-10"
            onClick={() => setIsContactOpen(true)}
          >
            <FaHeadset size={24} />
          </button>
          <MobileContactPopup
            isOpen={isContactOpen}
            closePopup={() => setIsContactOpen(false)}
          />
        </div>
      </div>
      <Footer/>
    </ProtectedRoute>
  );
}
