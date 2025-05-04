const ENDPOINTS = {
  CATEGORIES: {
    GET_ALL: (currentPage: number = 1, limit: number = 5, name?: string) => {
      const params = new URLSearchParams({
        currentPage: currentPage.toString(),
        limit: limit.toString(),
      });

      if (name) {
        params.append("name", name);
      }

      return `/api/categories?${params.toString()}`;
    },
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
    ADD: "/api/categories",
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
  BOOKS: {
    GET_ALL: "/api/books",
    GET_BY_ID: (id: string) => `/api/books/${id}`,
    ADD: "/api/books/add",
    UPDATE: (id: string) => `/api/books/${id}`,
    DELETE: (id: string) => `/api/books/${id}`,
  },
  REQUESTS: {
    GET_ALL: "/api/requests",
    GET_BY_ID: (id: string) => `/api/requests/${id}`,
    ADD: "/api/requests/add",
    UPDATE: (id: string) => `/api/requests/${id}`,
    DELETE: (id: string) => `/api/requests/${id}`,
  },
};

export default ENDPOINTS;
