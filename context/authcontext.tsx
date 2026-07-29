"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth";
import { ApiError, type LoginPayload, type SignupPayload, type User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean; // true only during the initial session-restore check
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On first mount, try to silently restore the session using the
  // httpOnly refresh cookie set by the backend during a previous login.
  useEffect(() => {
    let cancelled = false;

    authService.tryRestoreSession().then((restoredUser) => {
      if (!cancelled) {
        setUser(restoredUser);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setError(null);
    try {
      const loggedInUser = await authService.login(payload);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
      throw err;
    }
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    setError(null);
    try {
      await authService.signup(payload);
      // Signup doesn't log the user in automatically on the backend
      // (no token issued there) — send them to login after.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}