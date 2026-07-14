import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://customer-registry-1-2qb2.onrender.com/",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("ccUser");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
