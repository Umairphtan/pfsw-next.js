"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { AxiosError } from "axios";
import type { Category, CategoryFormInput } from "@/types/categroy";

interface CategoryFormProps {
  // Agar ye di gayi hai to form "Edit" mode me hai, warna "Create" mode
  initialData?: Category | null;
  onSubmit: (input: CategoryFormInput) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const isEditMode = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(initialData?.status ?? "active");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.image ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Nayi image select hone par uska local preview dikhao
  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    if (!isEditMode && !image) {
      setError("Please select an image");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), status, image });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Serum"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Image</label>

        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Category preview"
            className="mb-2 h-24 w-24 rounded-md border border-slate-200 object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-slate-700"
        />

        {isEditMode && (
          <p className="mt-1 text-xs text-slate-400">
            Leave empty to keep the current image
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}