import axios from "axios"

const BASE_URL = "http://localhost:3000";

// Important: send and receive cookies automatically
axios.defaults.withCredentials = true;

// Signup API
export const signupUser = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/user/createuser`,
    userData
  );
  return response.data;
};

// Login API (cookie will be stored automatically by browser)
export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${BASE_URL}/user/login`,
    loginData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Logout API (clears cookie on server)
export const logoutUser = async () => {
  const response = await axios.post(
    `${BASE_URL}/user/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Check current user from protected route (optional)
export const getCurrentUser = async () => {
  const response = await axios.get(
    `${BASE_URL}/user/me`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};


