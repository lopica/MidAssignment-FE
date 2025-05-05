export type StoreContextType = {
  userId: string;
  role: "admin" | "user";
};

export type StoreType = [
  StoreContextType,
  setStore: (store: StoreContextType) => void
];

export const statusColors: Record<"waiting" | "approved" | "rejected", string> =
  {
    waiting: "orange",
    approved: "green",
    rejected: "red",
  };

// Define the Book interface

export type DataIndex = keyof Book;

// Request interface
export interface Request {
  id: string;
  key: string;
  requestDate: string;
  dueDate: string;
  updateDate: string;
  books: Book[];
  requestorEmail: string;
  approverEmail: string;
  status: 0 | 1 | 2;
}

export type Book = {
  id: string;
  key: string;
  title: string;
  author: string;
  editionNumber: number;
  categories: Category[];
  quantity: number;
  isAvailable: boolean;
};

export type Category = {
  id?: string;
  key?: string;
  name: string;
  books: Book[];
};

export type Response = {
  success: boolean;
  statusCode: number;
  errors: string[] | null;
  content: any;
};

export type PaginatedResult<T> = {
  data: T[];
  currentPage: number;
  totalPage: number;
  limit: number;
};

export type CreateBookDto = {
  title: string;
  author: string;
  editionNumber: number;
  categoryIds: string[];
};

export type UpdateBookDto = CreateBookDto & {
  quantity: number;
  isAvailable: boolean;
};

export type CreateRequestDto = {
  requestorId: string;
  dueDate: string;
  bookIds: string[];
};

export type UpdateRequestDto = {
  status: 0 | 1 | 2;
  approverId: string;
  dueDate: string;
  bookIds: string[];
};
