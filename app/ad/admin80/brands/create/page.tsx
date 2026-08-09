"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useBrands } from "@/hook/hook";
import type { BrandStatus } from "@/types/brand";

export default function CreateBrandPage() {
  const router = useRouter();
  const { createBrand } = useBrands();

  const [name, setName] = useState("");
  const [status, setStatus] = useState<BrandStatus>("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setFormError(null);

    const result = await createBrand({ name, status, image: imageFile });

    setSubmitting(false);

    if (result) {
      router.push("/ad/admin80/brands"); // create hone ke baad list page pe wapas bhejo
    } else {
      setFormError("Brand create nahi ho saki. Dobara try karo.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Brand</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border p-5 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Brand Name</label>
          <input
            type="text"
            placeholder="e.g. Nivea"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BrandStatus)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {formError && <p className="text-red-600 text-sm">{formError}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Brand"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/ad/admin80/brands")}
            className="border rounded px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}