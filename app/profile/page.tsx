"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { useRequireAuth } from "@/utils/userqauth";

export default function ProfilePage() {
  const { user, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Checking session...</p>
      </main>
    );
  }

  if (!user) {
    // useRequireAuth already triggered a redirect; render nothing meanwhile
    return null;
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <dl className="flex flex-col gap-2 rounded border border-gray-200 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Phone</dt>
          <dd>{user.phone}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Role</dt>
          <dd>{user.role}</dd>
        </div>
      </dl>

      <button
        onClick={handleLogout}
        className="rounded border border-gray-300 px-3 py-2"
      >
        Log out
      </button>
    </main>
  );
}