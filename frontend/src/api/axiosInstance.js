// src/api/axiosInstance.js

import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

// We create a basic axios instance for API requests.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Axios Interceptor: This is a function that intercepts right before each request is sent.
axiosInstance.interceptors.request.use(
  (config) => {
    // We get the token from the browser's local storage.
    const token = localStorage.getItem("authToken");

    // If there is a token, we add it to the request header as 'Authorization'.
    // This way, we don't need to manually add the token to each request.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // In case of a request error, return the error.
    return Promise.reject(error);
  }
);

export default axiosInstance;
