"use client";

import type { Category } from "@/types/categroy";

interface CategoryTableProps {
  categories: Category[];
  deletingId: string | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({
  categories,
  deletingId,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="px-4 py-3">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-12 w-12 rounded-md border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                    No image
                  </div>
                )}
              </td>

              <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
              <td className="px-4 py-3 text-slate-500">{category.slug}</td>

              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    category.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {category.status}
                </span>
              </td>

              <td className="space-x-3 px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(category)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(category._id)}
                  disabled={deletingId === category._id}
                  className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {deletingId === category._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}