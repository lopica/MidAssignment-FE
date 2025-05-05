import { Category, PaginatedResult } from "../types";
import axios from "./axiosInstance";
import ENDPOINTS from "./endpoints";

export function getAllCategories(
  currentPage: number = 1,
  name?: string
): Promise<PaginatedResult<Category>> {
  return axios.get(ENDPOINTS.CATEGORIES.GET_ALL(currentPage, 5, name));
}
export const getAllCategoriesWithoutPagination = () : Promise<Category[]> => 
  axios.get(ENDPOINTS.CATEGORIES.GET_ALL_WITHOUT_PAGINATION());
export const addCategory = (category: {name: string}) : Promise<Category> =>
  axios.post(ENDPOINTS.CATEGORIES.ADD, category);
export const getCategoryById = (id: string) =>
  axios.get(ENDPOINTS.CATEGORIES.GET_BY_ID(id));
export const updateCategory = (id: string, category: {name: string}) =>
  axios.put(ENDPOINTS.CATEGORIES.UPDATE(id), category);
export const deleteCategory = (id: string) =>
  axios.delete(ENDPOINTS.CATEGORIES.DELETE(id));
