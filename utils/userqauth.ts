"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";

// Use inside any protected client component/page:
//   const { user } = useRequireAuth();
// Redirects to /login once we know for sure there's no session
// (waits for isLoading to settle so we don't redirect during the
// initial silent-refresh check on page load).
export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return { user, isLoading };
}