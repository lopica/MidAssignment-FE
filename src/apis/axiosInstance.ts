import axios from "axios";
import ENDPOINTS from "./endpoints";
import { useContext } from "react";
import { StoreContext } from "../context/store";
import { useNavigate } from "react-router";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAxiosInterceptor = () => {
  const [_, setStore] = useContext(StoreContext);
  const navigate = useNavigate();

  // ✅ Request Interceptor
  axiosInstance.interceptors.request.use(
    async (config: any) => {
      // Skip auth endpoints
      if (config.url?.startsWith("/api/auth")) return config;

      // If no token in headers, try to refresh
      if (!config.headers["Authorization"]) {
        try {
          const response = await axiosInstance.post(
            ENDPOINTS.AUTH.REFRESH,
            null,
            { withCredentials: true }
          );
          const newToken = response.headers["authorization"]?.replace(
            "Bearer ",
            ""
          );

          if (newToken) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } catch (err) {
          navigate("/");
          message.error("Unable to refresh token");
          console.error("Token refresh failed in request:", err);
        }
      }

      return config;
    },
    (error: any) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // ✅ Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      const isLogin = response.config?.url === ENDPOINTS.AUTH.LOGIN;
      const isAuth = response.config?.url?.startsWith("/api/auth");

      // Handle login
      if (isLogin && response.data.success) {
        const token = response.headers["authorization"]?.replace("Bearer ", "");
        const content = response.data.content;

        if (token && content) {
          const { email, role, id } = content;
          const user = {
            email,
            userId: id,
            role: role.toLowerCase(),
          };

          // Update context and localStorage
          setStore(user);
          localStorage.setItem("user", JSON.stringify(user));

          // Set token for next requests
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        }

        return response;
      }

      // Return only content for all non-auth success responses
      if (!isAuth && response.data?.success) {
        return response.data.content;
      }

      return response;
    },

    async (error) => {
      const originalRequest = error.config;
      const isAuthEndpoint = originalRequest?.url?.startsWith("/api/auth");

      const noToken =
        !originalRequest?.headers?.Authorization ||
        error?.response?.status === 401;

      // If no token or expired token, try refresh once
      if (
        originalRequest &&
        noToken &&
        !originalRequest._retry &&
        !isAuthEndpoint
      )
       {
        try {
          originalRequest._retry = true;

          const refreshRes = await axiosInstance.post(
            ENDPOINTS.AUTH.REFRESH,
            {},
            { withCredentials: true }
          );

          const newToken = refreshRes.headers["authorization"]?.replace(
            "Bearer ",
            ""
          );

          if (newToken) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest); // Retry original request
          }
        } catch (refreshError) {
          console.warn("Refresh token failed on retry:", refreshError);
          navigate("/");
          message.error("Session expired");
          return Promise.reject(refreshError);
        }
      }

      // Return structured errors if available
      if (error.response?.data?.errors) {
        return Promise.reject(error.response.data.errors);
      }
      console.error("💥 Axios error fallback triggered:", error);

      // Fallback error
      return Promise.reject(["Something went wrong"]);
    }
  );
};

export default axiosInstance;
