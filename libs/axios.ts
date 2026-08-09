import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "../utils/token";
import type { RefreshResponse } from "@/types/auth";

// Root API URL — har module (auth, brand, category, product) isi ek instance
// ko use karega, apna path khud prefix karega. e.g.:
//   authService    -> api.post("/auth/login")
//   brandService   -> api.get("/brands")
//   categoryService-> api.get("/categories")
//   productService -> api.get("/products")
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/auth";

// Refresh-loop se exempt paths (poora path likhna hai, kyunke ab baseURL root hai)
const AUTH_EXEMPT_PATHS = ["/auth/login", "/auth/signup", "/auth/refresh-token"];

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // httpOnly refresh cookie bhejne ke liye zaroori
  headers: { "Content-Type": "application/json" },
});

// ---- Request interceptor: access token attach ----
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: silent refresh on expired access token ----

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Ek waqt me sirf ek hi refresh call ho — baaki requests usi promise pe wait karein
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<RefreshResponse>("/auth/refresh-token")
      .then((res) => {
        const newToken = res.data.accessToken;
        tokenStore.set(newToken);
        return newToken;
      })
      .catch(() => {
        tokenStore.clear();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const status = error.response?.status;
    const url = originalRequest?.url ?? "";
    const isExempt = AUTH_EXEMPT_PATHS.some((path) => url.includes(path));

    if (status === 401 && originalRequest && !originalRequest._retry && !isExempt) {
      originalRequest._retry = true;

      const newToken = await performRefresh();

      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      }

      // Refresh fail -> session dead. Caller/UI /login pe redirect karega.
      tokenStore.clear();
    }

    return Promise.reject(error);
  }
);