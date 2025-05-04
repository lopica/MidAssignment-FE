import axios from "axios";
import type { Response } from "../types";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: unwrap `response.data.content` or throw `errors`
axiosInstance.interceptors.response.use(
  function (response) {
    const data = response.data as Response;

    if (data.success) {
      return data.content; // ✅ Return only the inner content
    }

    // ❌ Failure - throw errors as array
    throw data.errors ?? ["Unknown error"];
  },
  function (error) {
    // Network or server error fallback
    if (error?.response?.data?.errors) {
      throw error.response.data.errors;
    }
    throw ["Unexpected error occurred"];
  }
);

export default axiosInstance;
