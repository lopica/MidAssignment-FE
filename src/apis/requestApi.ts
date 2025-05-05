import { Book, CreateBookDto, CreateRequestDto, PaginatedResult, Request, UpdateBookDto, UpdateRequestDto } from "../types";
import axios from "./axiosInstance";
import ENDPOINTS from "./endpoints";

export function getAllRequests(
  currentPage: number = 1,
  userId?: string
): Promise<PaginatedResult<Request>> {
  return axios.get(ENDPOINTS.REQUESTS.GET_ALL(currentPage, 5, userId));
}
export const addRequest = (request: Readonly<CreateRequestDto>) : Promise<Request> =>
  axios.post(ENDPOINTS.REQUESTS.ADD, request);
export const getRequestById = (id: string) =>
  axios.get(ENDPOINTS.REQUESTS.GET_BY_ID(id));
export const updateRequest = (id: string, request: UpdateRequestDto) =>
  axios.put(ENDPOINTS.REQUESTS.UPDATE(id), request);
export const deleteRequest = (id: string) =>
  axios.delete(ENDPOINTS.REQUESTS.DELETE(id));


