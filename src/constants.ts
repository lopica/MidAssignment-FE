import { Book, Category, PaginatedResult, Request, StoreContextType } from "./types";

export const DEFAULT_STORE_VALUE: StoreContextType = {
  userId: "",
  email: "",
  role: "",
};



// Step 1: Initialize empty arrays
export const DEFAULT_BOOKS: Book[] = [];
export const DEFAULT_CATEGORIES: Category[] = [];

// Step 2: Fill categories first with just names and keys
DEFAULT_CATEGORIES.push(
  { key: "1", name: "Fiction", books: [] },
  { key: "2", name: "Fantasy", books: [] },
  { key: "3", name: "Dystopian", books: [] },
  { key: "4", name: "Classic", books: [] },
  { key: "5", name: "Romance", books: [] },
  { key: "6", name: "Coming-of-age", books: [] },
  { key: "7", name: "Adventure", books: [] },
  { key: "8", name: "Philosophy", books: [] },
  { key: "9", name: "Drama", books: [] },
  { key: "10", name: "Science Fiction", books: [] },
  { key: "11", name: "Psychological Fiction", books: [] },
  { key: "12", name: "Mystery", books: [] },
  { key: "13", name: "Historical", books: [] }
);

// Step 3: Create books, now that categories exist
DEFAULT_BOOKS.push(
  {
    id: "1",
    key: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    editionNumber: 3,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Fiction")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Classic")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Drama")!,
    ],
    quantity: 5,
    isAvailable: true,
  },
  {
    id: "2",
    key: "2",
    title: "1984",
    author: "George Orwell",
    editionNumber: 2,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Science Fiction")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Dystopian")!,
    ],
    quantity: 0,
    isAvailable: false,
  },
  {
    id: "3",
    key: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    editionNumber: 5,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Classic")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Fiction")!,
    ],
    quantity: 3,
    isAvailable: true,
  },
  {
    id: "4",
    key: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    editionNumber: 1,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Romance")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Classic")!,
    ],
    quantity: 2,
    isAvailable: true,
  },
  {
    id: "5",
    key: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    editionNumber: 4,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Fiction")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Coming-of-age")!,
    ],
    quantity: 0,
    isAvailable: false,
  },
  {
    id: "6",
    key: "6",
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
    editionNumber: 3,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Fantasy")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Adventure")!,
    ],
    quantity: 7,
    isAvailable: true,
  },
  {
    id: "7",
    key: "7",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    editionNumber: 2,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Fantasy")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Adventure")!,
    ],
    quantity: 3,
    isAvailable: true,
  },
  {
    id: "8",
    key: "8",
    title: "Brave New World",
    author: "Aldous Huxley",
    editionNumber: 1,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Science Fiction")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Dystopian")!,
    ],
    quantity: 4,
    isAvailable: true,
  },
  {
    id: "9",
    key: "9",
    title: "The Alchemist",
    author: "Paulo Coelho",
    editionNumber: 3,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Fiction")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Philosophy")!,
    ],
    quantity: 0,
    isAvailable: false,
  },
  {
    id: "10",
    key: "10",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    editionNumber: 6,
    categories: [
      DEFAULT_CATEGORIES.find(c => c.name === "Classic")!,
      DEFAULT_CATEGORIES.find(c => c.name === "Psychological Fiction")!,
    ],
    quantity: 2,
    isAvailable: true,
  }
);

// Step 4: Assign books to categories now that books exist
DEFAULT_CATEGORIES.forEach(category => {
  category.books = DEFAULT_BOOKS.filter(book =>
    book.categories.some(cat => cat.name === category.name)
  );
});

export const DEFAULT_REQUESTS: Request[] = [
  {
    id: "r1",
    key: "1",
    requestDate: "2024-05-01",
    dueDate: "2024-05-15",
    updateDate: "2024-05-01",
    requestorEmail: "john.doe@example.com",
    approverEmail: "admin@example.com",
    books: [
      DEFAULT_BOOKS.find((book) => book.title === "1984")!,
      DEFAULT_BOOKS.find((book) => book.title === "The Hobbit")!,
    ],
    status: 0, // approved
  },
  {
    id: "r2",
    key: "2",
    requestDate: "2024-04-28",
    dueDate: "2024-05-10",
    updateDate: "2024-04-29",
    requestorEmail: "jane.doe@example.com",
    approverEmail: "admin@example.com",
    books: [
      DEFAULT_BOOKS.find((book) => book.title === "To Kill a Mockingbird")!,
    ],
    status: 1, // rejected
  },
  {
    id: "r3",
    key: "3",
    requestDate: "2024-04-26",
    dueDate: "2024-05-09",
    updateDate: "2024-04-26",
    requestorEmail: "alice@example.com",
    approverEmail: "admin@example.com",
    books: [
      DEFAULT_BOOKS.find((book) => book.title === "Brave New World")!,
      DEFAULT_BOOKS.find((book) => book.title === "The Alchemist")!,
    ],
    status: 2, // waiting
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
