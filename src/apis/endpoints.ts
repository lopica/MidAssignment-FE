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
    GET_ALL_WITHOUT_PAGINATION: () => `/api/categories/no-paginate`,
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
    ADD: "/api/categories",
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
  BOOKS: {
    GET_ALL: (currentPage: number = 1, limit: number = 5, title?: string) => {
      const params = new URLSearchParams({
        currentPage: currentPage.toString(),
        limit: limit.toString(),
      });
  
      if (title) {
        params.append("title", title);
      }
  
      return `/api/books?${params.toString()}`;
    },
    GET_BY_ID: (id: string) => `/api/books/${id}`,
    ADD: "/api/books",
    UPDATE: (id: string) => `/api/books/${id}`,
    DELETE: (id: string) => `/api/books/${id}`,
  },
  REQUESTS: {
    GET_ALL: (currentPage: number = 1, limit: number = 5, userId?: string) => {
        const params = new URLSearchParams({
          currentPage: currentPage.toString(),
          limit: limit.toString(),
        });
    
        if (userId) {
          params.append("userId", userId);
        }
    
        return `/api/borrowing-requests?${params.toString()}`;
      },
    GET_BY_ID: (id: string) => `/api/borrowing-requests/${id}`,
    ADD: "/api/borrowing-requests",
    UPDATE: (id: string) => `/api/borrowing-requests/${id}`,
    DELETE: (id: string) => `/api/borrowing-requests/${id}`,
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "api/auth/refresh",
  }
};

export default ENDPOINTS;
