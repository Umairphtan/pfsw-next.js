"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category";
import type { Category, CategoryFormInput } from "@/types/categroy";
import CategoryForm from "@/commponents/categoryform"
import CategoryTable from "@/commponents/categorytable";
import CategoryModal from "@/commponents/categorymodal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------------- Load categories on page open ----------------
  const loadCategories = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      setLoadError("Failed to load categories. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ---------------- Form open/close helpers ----------------
  const openCreateForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  // ---------------- Create / Update ----------------
  // Same form Create aur Edit dono ke liye use hota hai — yahan decide hota hai
  // ke konsa API call karna hai
  const handleSubmit = async (input: CategoryFormInput) => {
    if (editingCategory) {
      const updated = await categoryService.update(editingCategory._id, input);
      // List me sirf usi category ko update karo — pura page reload nahi karna
      setCategories((prev) =>
        prev.map((category) => (category._id === updated._id ? updated : category))
      );
    } else {
      const created = await categoryService.create(input);
      // Nayi category list ke sabse upar dikhao
      setCategories((prev) => [created, ...prev]);
    }
    closeForm();
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this category? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch {
      alert("Failed to delete category, please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your store&apos;s product categories.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Category
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading categories...</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {!loading && !loadError && categories.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center">
          <p className="text-sm text-slate-500">No categories yet. Create your first one.</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <CategoryTable
          categories={categories}
          deletingId={deletingId}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <CategoryModal
          title={editingCategory ? "Edit Category" : "New Category"}
          onClose={closeForm}
        >
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </CategoryModal>
      )}
    </div>
  );
}