import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "../utils/token";
import type { RefreshResponse } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/auth";

// Requests that must NOT trigger the refresh-and-retry flow,
// otherwise a failed login could loop forever trying to "refresh".
const AUTH_EXEMPT_PATHS = ["/login", "/signup", "/refresh-token"];

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // required so the httpOnly refresh cookie is sent
  headers: { "Content-Type": "application/json" },
});

// ---- Request interceptor: attach access token ----
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: silent refresh on expired access token ----

// Extend AxiosRequestConfig so we can mark a request as "already retried"
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// If multiple requests 401 at the same time, only refresh once and
// let the others wait on the same in-flight promise.
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<RefreshResponse>("/refresh-token")
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

      // Refresh failed -> session is truly dead. Let the caller/UI handle
      // redirecting to /login; we just make sure local state is clean.
      tokenStore.clear();
    }

    return Promise.reject(error);
  }
);