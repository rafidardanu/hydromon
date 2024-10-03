import axios from "axios";
import * as jwtDecode from "jwt-decode";

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const removeAuthToken = () => {
  delete axios.defaults.headers.common["Authorization"];
  localStorage.removeItem("token");
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode.jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return true;
  }
};
