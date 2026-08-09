"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { brandService } from "@/services/brand";
import { useBrands } from "@/hook/hook";
import type { Brand, BrandStatus } from "@/types/brand";

const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === "") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { updateBrand } = useBrands();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<BrandStatus>("active");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const data = await brandService.getById(id);
        setBrand(data);
        setName(data.name);
        setStatus(data.status);
      } catch {
        setFormError("Brand load nahi ho saki");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) loadBrand();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setFormError(null);

    const result = await updateBrand(id, { name, status, image: imageFile });

    setSubmitting(false);

    if (result) {
      router.push("/ad/admin80/brands"); // 👈 apka actual list route
    } else {
      setFormError("Update fail ho gaya. Dobara try karo.");
    }
  };

  if (pageLoading) {
    return <div className="p-6 max-w-lg mx-auto">Loading...</div>;
  }

  if (!brand) {
    return <div className="p-6 max-w-lg mx-auto text-red-600">Brand nahi mili</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Brand</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border p-5 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Current Image</label>
          {isValidImageUrl(brand.image) ? (
            <div className="relative w-32 h-32 mb-2">
              <Image src={brand.image} alt={brand.name} fill className="object-contain rounded border" />
            </div>
          ) : (
            <div className="w-32 h-32 mb-2 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand Name</label>
          <input
            type="text"
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
          <label className="block text-sm font-medium mb-1">
            Replace Image <span className="text-gray-400 font-normal">(optional)</span>
          </label>
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
            {submitting ? "Updating..." : "Update Brand"}
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