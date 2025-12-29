// Base API service with common functionality

// Configuration
const getBaseURL = (): string => {
  return (import.meta as any).env?.VITE_API_BASE_URL || "";
};

// Token management
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

const removeToken = (): void => {
  localStorage.removeItem("token");
};

const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get headers for API requests
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth && getToken()) {
    headers["Authorization"] = `Bearer ${getToken()}`;
  }
  return headers;
};

// Handle token expiry
const handleTokenExpiry = (): void => {
  removeToken();
  window.dispatchEvent(new CustomEvent("tokenExpired"));

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Unified API function
export const api = async <T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: any;
    includeAuth?: boolean;
    headers?: HeadersInit;
  } = {}
): Promise<T> => {
  const {
    method = "GET",
    data,
    includeAuth = true,
    headers: customHeaders = {},
  } = options;

  const baseURL = getBaseURL();
  const url = endpoint.startsWith("http") ? endpoint : `${baseURL}${endpoint}`;

  const requestOptions: RequestInit = {
    method,
    headers: {
      ...getHeaders(includeAuth),
      ...customHeaders,
    },
  };

  if (data && method !== "GET") {
    if (data instanceof FormData) {
      delete (requestOptions.headers as any)["Content-Type"];
      requestOptions.body = data;
    } else {
      requestOptions.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    if (response.status === 401 && includeAuth) {
      handleTokenExpiry();
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// API Response interface
export interface ApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}

// Convenience methods
export const apiService = {
  get: <T>(
    endpoint: string,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> =>
    api<ApiResponse<T>>(endpoint, { method: "GET", includeAuth }),

  post: <T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> =>
    api<ApiResponse<T>>(endpoint, { method: "POST", data, includeAuth }),

  put: <T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> =>
    api<ApiResponse<T>>(endpoint, { method: "PUT", data, includeAuth }),

  patch: <T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> =>
    api<ApiResponse<T>>(endpoint, { method: "PATCH", data, includeAuth }),

  delete: <T>(
    endpoint: string,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> =>
    api<ApiResponse<T>>(endpoint, { method: "DELETE", includeAuth }),
};

// Export utility functions
export const apiUtils = {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  getBaseURL,
};
