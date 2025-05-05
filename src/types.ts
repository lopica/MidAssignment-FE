export type StoreContextType =
  | {
      role: "admin" | "user";
    }
  | {
      role: "user";
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
  key: string;
  requestor: string;
  dateRequested: string;
  books: Book[];
  status: "waiting" | "approved" | "rejected";
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
  content: any
}

export type PaginatedResult<T> = {
  data: T[];
  currentPage: number;
  totalPage: number;
  limit: number;
}

export type CreateBookDto = {
  title: string;
  author: string;
  editionNumber: number;
  categoryIds: string[];
}

export type UpdateBookDto = CreateBookDto & {
  quantity: number;
  isAvailable: boolean;
}