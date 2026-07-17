import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");

      sessionStorage.setItem(
        "sessionExpired",
        "Your session has expired, Please login again.",
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
