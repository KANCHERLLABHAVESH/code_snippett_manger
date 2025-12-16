import axios from "axios";
import { useAuthContext } from "../context/AuthContext.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("csm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Small helper hook for components that want an axios instance already bound
export const useApi = () => {
  const { token } = useAuthContext();
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return api;
};

export default api;

