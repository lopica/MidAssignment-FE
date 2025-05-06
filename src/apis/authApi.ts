import { LoginDto, LoginResponseDto } from "../types";
import axios from "./axiosInstance";
import ENDPOINTS from "./endpoints";

export function login(requestBody: LoginDto): Promise<LoginResponseDto> {
  return axios.post(ENDPOINTS.AUTH.LOGIN, requestBody, {
    withCredentials: true,
  });
}
export const logout = (): Promise<string> =>
  axios.post(ENDPOINTS.AUTH.LOGOUT, null, { withCredentials: true });

export const refresh = (): Promise<string> =>
  axios.post(ENDPOINTS.AUTH.REFRESH, null, { withCredentials: true });
