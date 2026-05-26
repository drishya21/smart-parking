import axios from "axios";

const API_URL = "https://smart-parking-dq5f.onrender.com";

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "login/", {
      username: email, // IMPORTANT
      password: password,
    });

    console.log("LOGIN RESPONSE:", response.data);

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return true;
  } catch (error) {
    console.log("LOGIN ERROR:", error.response?.data);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const isAuthenticated = () => {
  return localStorage.getItem("access") !== null;
};