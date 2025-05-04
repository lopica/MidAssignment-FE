import { Book, Category, PaginatedResult, Request, StoreContextType } from "./types";

export const DEFAULT_STORE_VALUE: StoreContextType = {
  role: "admin",
};

export const DEFAULT_BOOKS: Book[] = [
  {
    key: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    editionNumber: 3,
    categories: ["Fiction", "Classic", "Drama"],
    quantity: 5,
    isAvailable: true,
  },
  {
    key: "2",
    title: "1984",
    author: "George Orwell",
    editionNumber: 2,
    categories: ["Science Fiction", "Dystopian"],
    quantity: 0,
    isAvailable: false,
  },
  {
    key: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    editionNumber: 5,
    categories: ["Classic", "Fiction"],
    quantity: 3,
    isAvailable: true,
  },
  {
    key: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    editionNumber: 1,
    categories: ["Romance", "Classic"],
    quantity: 2,
    isAvailable: true,
  },
  {
    key: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    editionNumber: 4,
    categories: ["Fiction", "Coming-of-age"],
    quantity: 0,
    isAvailable: false,
  },
  {
    key: "6",
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
    editionNumber: 3,
    categories: ["Fantasy", "Adventure"],
    quantity: 7,
    isAvailable: true,
  },
  {
    key: "7",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    editionNumber: 2,
    categories: ["Fantasy", "Adventure"],
    quantity: 3,
    isAvailable: true,
  },
  {
    key: "8",
    title: "Brave New World",
    author: "Aldous Huxley",
    editionNumber: 1,
    categories: ["Science Fiction", "Dystopian"],
    quantity: 4,
    isAvailable: true,
  },
  {
    key: "9",
    title: "The Alchemist",
    author: "Paulo Coelho",
    editionNumber: 3,
    categories: ["Fiction", "Philosophy"],
    quantity: 0,
    isAvailable: false,
  },
  {
    key: "10",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    editionNumber: 6,
    categories: ["Classic", "Psychological Fiction"],
    quantity: 2,
    isAvailable: true,
  },
];

export const DEFAULT_REQUESTS: Request[] = [
  {
    key: "1",
    requestor: "john.doe@example.com",
    dateRequested: "2024-05-01",
    books: [
      DEFAULT_BOOKS.find((book) => book.title === "1984")!,
      DEFAULT_BOOKS.find((book) => book.title === "The Hobbit")!,
    ],
    status: "waiting",
  },
  {
    key: "2",
    requestor: "jane.smith@example.com",
    dateRequested: "2024-04-28",
    books: [
      DEFAULT_BOOKS.find((book) => book.title === "To Kill a Mockingbird")!,
    ],
    status: "approved",
  },
  {
    key: "3",
    requestor: "alice@example.com",
    dateRequested: "2024-04-26",
    books: [
      DEFAULT_BOOKS.find((book) => book.title === "Brave New World")!,
      DEFAULT_BOOKS.find((book) => book.title === "The Alchemist")!,
    ],
    status: "rejected",
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    key: "1",
    name: "Fiction",
    books: DEFAULT_BOOKS.filter((book) =>
      ["1984", "To Kill a Mockingbird", "The Alchemist"].includes(book.title)
    ),
  },
  {
    key: "2",
    name: "Fantasy",
    books: DEFAULT_BOOKS.filter((book) =>
      ["The Hobbit", "Lord of the Rings"].includes(book.title)
    ),
  },
  {
    key: "3",
    name: "Dystopian",
    books: DEFAULT_BOOKS.filter((book) => book.title === "Brave New World"),
  },
  {
    key: "4",
    name: "Classic",
    books: DEFAULT_BOOKS.filter((book) =>
      ["The Great Gatsby", "Crime and Punishment"].includes(book.title)
    ),
  },
  {
    key: "5",
    name: "Romance",
    books: DEFAULT_BOOKS.filter((book) => book.title === "Pride and Prejudice"),
  },
  {
    key: "6",
    name: "Coming-of-age",
    books: DEFAULT_BOOKS.filter((book) => book.title === "The Catcher in the Rye"),
  },
  {
    key: "7",
    name: "Adventure",
    books: DEFAULT_BOOKS.filter((book) =>
      ["The Hobbit", "Lord of the Rings"].includes(book.title)
    ),
  },
  {
    key: "8",
    name: "Philosophy",
    books: DEFAULT_BOOKS.filter((book) => book.title === "The Alchemist"),
  },
  {
    key: "9",
    name: "Drama",
    books: DEFAULT_BOOKS.filter((book) => book.title === "To Kill a Mockingbird"),
  },
  {
    key: "10",
    name: "Science Fiction",
    books: DEFAULT_BOOKS.filter((book) =>
      ["Brave New World", "1984"].includes(book.title)
    ),
  },
  {
    key: "11",
    name: "Psychological Fiction",
    books: DEFAULT_BOOKS.filter((book) => book.title === "Crime and Punishment"),
  },
  {
    key: "12",
    name: "Mystery",
    books: [],
  },
  {
    key: "13",
    name: "Historical",
    books: [],
  },
];


export const PAGINATED_BOOKS: PaginatedResult<Book> = {
  data: DEFAULT_BOOKS.slice(0, 5), // Simulating page 1
  currentPage: 1,
  totalPage: Math.ceil(DEFAULT_BOOKS.length / 5),
  limit: 5,
};

export const PAGINATED_REQUESTS: PaginatedResult<Request> = {
  data: DEFAULT_REQUESTS,
  currentPage: 1,
  totalPage: 1,
  limit: 5,
};

export const PAGINATED_CATEGORIES: PaginatedResult<Category> = {
  data: DEFAULT_CATEGORIES.slice(0, 5), // simulate page 1
  currentPage: 1,
  totalPage: Math.ceil(DEFAULT_CATEGORIES.length / 5), // = 3
  limit: 5,
};
