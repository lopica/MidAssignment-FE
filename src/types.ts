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
  key: string;
  title: string;
  author: string;
  editionNumber: number;
  categories: string[];
  quantity: number;
  isAvailable: boolean;
};

export type Category = {
  key: string;
  name: string;
  books: Book[];
};
