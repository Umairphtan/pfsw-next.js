// Central place for auth-related types.
// Keep these in sync with whatever the backend controller actually returns.

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface SignupPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Generic shape every backend response follows (success/message/... )
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  code?: string; // e.g. "TOKEN_EXPIRED", used by the axios interceptor
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse extends ApiResponse {
  accessToken: string;
}

export interface ProfileResponse extends ApiResponse {
  user: User;
}

// Normalized error shape thrown by the service layer, so components
// never need to know about axios internals.
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}