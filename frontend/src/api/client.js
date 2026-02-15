import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("ecoUser");
  if (raw) {
    const user = JSON.parse(raw);
    if (user?.role) {
      config.headers["x-user-role"] = user.role;
    }
  }
  return config;
});

export default api;
