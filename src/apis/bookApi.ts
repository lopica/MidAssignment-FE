import { Book, CreateBookDto, PaginatedResult, UpdateBookDto } from "../types";
import axios from "./axiosInstance";
import ENDPOINTS from "./endpoints";

export function getAllBooks(
  currentPage: number = 1,
  name?: string
): Promise<PaginatedResult<Book>> {
  return axios.get(ENDPOINTS.BOOKS.GET_ALL(currentPage, 5, name));
}
export const addBook = (book: Readonly<CreateBookDto>) : Promise<Book> =>
  axios.post(ENDPOINTS.BOOKS.ADD, book);
export const getBookById = (id: string) =>
  axios.get(ENDPOINTS.BOOKS.GET_BY_ID(id));
export const updateBook = (id: string, book: UpdateBookDto) =>
  axios.put(ENDPOINTS.BOOKS.UPDATE(id), book);
export const deleteBook = (id: string) =>
  axios.delete(ENDPOINTS.BOOKS.DELETE(id));


