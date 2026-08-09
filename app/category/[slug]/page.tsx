"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categoryService } from "@/services/category";
import type { Category } from "@/types/categroy";

// NOTE: "products" ka type abhi "unknown[]" hai (types/category.ts me).
// Jab aap Product type banayein, us file me CategoryWithProducts.products
// ko Product[] kar dein — is component me koi change nahi karna padega.
export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await categoryService.getBySlug(params.slug);
        setCategory(data.category);
        setProducts(data.products);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.slug]);

  if (loading) {
    return <p className="px-6 py-10 text-sm text-slate-500">Loading...</p>;
  }

  if (notFound || !category) {
    return <p className="px-6 py-10 text-sm text-slate-500">Category not found.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">{category.name}</h1>
      <p className="mt-1 text-sm text-slate-500">{products.length} products</p>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No products in this category yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {/* Product card yahan aayega — Product type/component bante hi
              is JSON ({products.map(...)}) ko replace kar dein */}
          <p className="col-span-full text-sm text-slate-400">
            Product cards go here once the Product module is connected.
          </p>
        </div>
      )}
    </div>
  );
}