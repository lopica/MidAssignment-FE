import { useContext } from "react";
import { StoreContext } from "../context/store";
import axiosInstance from "../apis/axiosInstance";
import ENDPOINTS from "../apis/endpoints";
import { LoginDto } from "../types";

export function useAuth() {
  const [_, setStore] = useContext(StoreContext);

  const login = async (requestBody: LoginDto) => {
    const res = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, requestBody);

    const content = res.data?.content;
    const token = res.headers["authorization"]?.replace("Bearer ", "");

    if (token && content) {
      const { email, id, role } = content;
      const newUser = {
        email,
        userId: id,
        role: role.toLowerCase(),
      };

      setStore(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  const logout = async () => {
    await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
    setStore({ email: "", userId: "", role: "" });
    localStorage.removeItem("user");
  };

  return { login, logout };
}
