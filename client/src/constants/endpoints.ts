const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

export const ENDPOINT_URLS = {
  USERS: {
    LOGIN: `${API_PREFIX}/login`,
    SIGNUP: `${API_PREFIX}/signup`,
    PROFILE: `${API_PREFIX}/users/profile`,
    LOGOUT: `${API_PREFIX}/logout`,
    IMAGE: {
      UPLOAD: `${API_PREFIX}/image/upload`,
      DELETE: `${API_PREFIX}/image/delete`,
    },
  },
  PRODUCTS: {
    LIST: `${API_PREFIX}/products`,
    DETAIL: (id: string) => `${API_PREFIX}/products/${id}`,
    BY_SLUG: (slug: string) => `${API_PREFIX}/products/slug/${slug}`,
    CREATE: `${API_PREFIX}/products`,
    UPDATE: (id: string) => `${API_PREFIX}/products/${id}`,
    DELETE: (id: string) => `${API_PREFIX}/products/${id}`,
  },
  CATEGORIES: {
    LIST: `${API_PREFIX}/categories`,
    DETAIL: (id: string) => `${API_PREFIX}/categories/${id}`,
    CREATE: `${API_PREFIX}/categories`,
    UPDATE: (id: string) => `${API_PREFIX}/categories/${id}`,
    DELETE: (id: string) => `${API_PREFIX}/categories/${id}`,
  },
} as const;
