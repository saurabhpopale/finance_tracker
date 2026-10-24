
import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const baseURL = rawBaseURL.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string"
        ? error.response.data
        : null) ||
      error.message ||
      "Something went wrong";

    error.message = message;
    return Promise.reject(error);
  }
);

export default api;
