"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authcontext";

export default function SignupPage() {
  const { signup, error, clearError } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      clearError();
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signup(form);
      router.push("/login");
    } catch {
      // error already captured in context state
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={update("name")}
          className="rounded border border-gray-300 px-3 py-2"
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={update("phone")}
          className="rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          className="rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={update("password")}
          className="rounded border border-gray-300 px-3 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}