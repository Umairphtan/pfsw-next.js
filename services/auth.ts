import { AxiosError } from "axios";
import { api } from "@/libs/axios";
import { tokenStore } from "@/utils/token";
import {
  ApiError,
  type AuthResponse,
  type LoginPayload,
  type ProfileResponse,
  type RefreshResponse,
  type SignupPayload,
  type User,
} from "@/types/auth";

// Converts any axios error into our normalized ApiError,
// so components/hooks only ever deal with one error shape.
function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      "Something went wrong. Please try again.";
    const code = (error.response?.data as { code?: string } | undefined)?.code;
    return new ApiError(message, error.response?.status ?? 500, code);
  }
  return new ApiError("Unexpected error", 500);
}

export const authService = {
  async signup(payload: SignupPayload): Promise<User> {
    try {
      const { data } = await api.post<AuthResponse>("/signup", payload);
      return data.user;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async login(payload: LoginPayload): Promise<User> {
    try {
      const { data } = await api.post<AuthResponse>("/login", payload);
      tokenStore.set(data.accessToken);
      return data.user;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      // even if the network call fails, clear local state so the UI
      // doesn't stay "logged in" against a dead session
      throw toApiError(error);
    } finally {
      tokenStore.clear();
    }
  },

  async getProfile(): Promise<User> {
    try {
      const { data } = await api.get<ProfileResponse>("/profile");
      return data.user;
    } catch (error) {
      throw toApiError(error);
    }
  },

  // Called once on app load to silently restore a session from the
  // httpOnly refresh cookie, without the user having to log in again.
  async tryRestoreSession(): Promise<User | null> {
    try {
      const { data } = await api.post<RefreshResponse>("/refresh-token");
      tokenStore.set(data.accessToken);
      return await authService.getProfile();
    } catch {
      tokenStore.clear();
      return null;
    }
  },
};