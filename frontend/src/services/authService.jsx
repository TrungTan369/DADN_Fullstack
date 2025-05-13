import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const getLastUsedDevices = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/last-used`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch last used devices" }
    );
  }
};




export const changePassword = async (token, oldPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Password change failed" };
  }
};


