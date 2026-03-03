import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("ecoUser");
  if (raw) {
    const stored = JSON.parse(raw);
    const token = stored?.token || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
