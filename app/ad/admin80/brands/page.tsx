"use client";

import Link from "next/link";
import Image from "next/image";
import { useBrands } from "@/hook/hook";

const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === "") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function BrandsAdminPage() {
  const { brands, loading, error, deleteBrand } = useBrands();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Kya ap is brand ko delete karna chahte hain?")) return;
    await deleteBrand(id);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        {/* 👇 apka actual create route */}
        <Link href="/ad/admin80/brands/create" className="bg-black text-white rounded px-4 py-2 text-sm">
          + Add Brand
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : brands.length === 0 ? (
        <p className="text-gray-500">Koi brand nahi mili. "Add Brand" pe click karke banao.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div key={brand._id} className="border rounded-lg p-3">
              {isValidImageUrl(brand.image) ? (
                <div className="relative w-full h-32 mb-2">
                  <Image src={brand.image} alt={brand.name} fill className="object-contain rounded" />
                </div>
              ) : (
                <div className="w-full h-32 mb-2 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}

              <p className="font-medium">{brand.name}</p>

              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                  brand.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {brand.status}
              </span>

              <div className="flex gap-3 mt-2">
                {/* 👇 apka actual edit route */}
                <Link href={`/ad/admin80/brands/${brand._id}/edit`} className="text-blue-600 text-sm">
                  Edit
                </Link>
                <button onClick={() => handleDelete(brand._id)} className="text-red-600 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}