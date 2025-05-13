import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { getUserProfile } from "@/services/deviceService";
import { changePassword } from "@/services/authService";


export default function ProfileForm() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      getUserProfile(token)
        .then((userData) => {
          setUser({
            username: userData.username,
            email: userData.email,
            password: "",
          });
        })
        .catch((error) => {
          console.error("There was an error fetching the user data!", error);
        });
    }
  }, []);  

  const handleEditClick = () => {
    setIsEditingPassword(true);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await changePassword(token, oldPassword, newPassword);
      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
    } catch (err) {
      setMessage(err.message || "Error changing password.");
    }
  };
  

  return (
    <div className="bg-[#303030] p-4 rounded-lg shadow-lg">
      <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
        <FaPen /> Edit Profile
      </h2>
      <div className="w-24 h-24 bg-gray-600 rounded-full mb-4 overflow-hidden">
        <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
      </div>
      <form className="space-y-3" onSubmit={handlePasswordChange}>
        {/* Username field */}
        <div>
          <label className="block text-gray-400 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            className="w-full p-2 bg-gray-600 rounded-md border border-gray-600"
            disabled
          />
        </div>

        {/* Email field */}
        <div>
          <label className="block text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            className="w-full p-2 bg-gray-600 rounded-md border border-gray-600"
            disabled
          />
        </div>

        {/* Password section */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400 mb-1">Password</label>
          <FaPen
            onClick={handleEditClick}
            className={`cursor-pointer ${isEditingPassword ? "text-blue-500" : "text-gray-400"}`}
          />

        </div>

        {isEditingPassword && (
          <>
            <div>
              <label className="block text-gray-400 mb-1">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 bg-gray-600 rounded-md border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 bg-gray-600 rounded-md border border-gray-600"
              />
            </div>
          </>
        )}
        {!isEditingPassword && (
          <input
            type="password"
            name="password"
            value="********"
            disabled
            className="w-full p-2 bg-gray-600 rounded-md border border-gray-600 pr-10"
          />
        )}


        {message && (
          <div className="text-sm text-white bg-gray-700 p-2 rounded">
            {message}
          </div>
        )}

        





        <button
          type="submit"
          className="w-full bg-blue-500 p-2 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
