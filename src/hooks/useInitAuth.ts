import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { StoreContext } from "../context/store";
import axiosInstance from "../apis/axiosInstance";
import ENDPOINTS from "../apis/endpoints";

export const useInitAuth = () => {
  const [_, setStore] = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tryRestore = async () => {
      const saved = localStorage.getItem("user");

      if (!saved) {
        setIsLoading(false);
        navigate("/");
        return;
      }

      const user = JSON.parse(saved);

      const controller = new AbortController(); // to cancel long requests
      const timeoutId = setTimeout(() => {
        controller.abort(); // stop request after 5s
      }, 5000);

      try {
        const res = await axiosInstance.post(
          ENDPOINTS.AUTH.REFRESH,
          null,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId); // cancel timer if successful

        const token = res.headers["authorization"]?.replace("Bearer ", "");
        if (token) {
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setStore(user);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("❌ Refresh failed or timed out", err);
      }

      clearTimeout(timeoutId);
      localStorage.removeItem("user");
      navigate("/");
      setIsLoading(false);
    };

    tryRestore();
  }, []);

  return { isLoading };
};
