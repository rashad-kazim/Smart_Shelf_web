// src/api/axiosInstance.js

import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

// API istekleri için temel bir axios örneği (instance) oluşturuyoruz.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Axios Interceptor: Bu, her istek gönderilmeden hemen önce araya giren bir fonksiyondur.
axiosInstance.interceptors.request.use(
  (config) => {
    // Tarayıcının yerel hafızasından (localStorage) token'ı alıyoruz.
    const token = localStorage.getItem("authToken");

    // Eğer token varsa, isteğin başlığına (Header) 'Authorization' olarak ekliyoruz.
    // Bu sayede her istekte token'ı manuel olarak eklememize gerek kalmaz.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // İstek hatası durumunda hatayı geri döndür.
    return Promise.reject(error);
  }
);

export default axiosInstance;
