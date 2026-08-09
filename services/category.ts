// ============================================================
// Category Service — sare Category API calls yahan hain.
// Components isay direct axios use karne ke bajaye call karenge,
// taake API ka structure change ho to sirf yahi file update karni pade.
// ============================================================

// IMPORTANT: Ye path apne project ke mutabiq adjust karein — ye us
// axios instance ko import kar raha hai jo aap ne pehle share ki thi
// (interceptors + refresh-token logic wali).
import { api } from "@/libs/axios";

import type {
  Category,
  CategoryListResponse,
  CategorySingleResponse,
  CategoryMutationResponse,
  CategoryWithProducts,
  DeleteResponse,
  CategoryFormInput,
} from "@/types/categroy";

// Aapki axios baseURL "http://localhost:5000/api/auth" hai, aur backend
// routes "/api/auth/category" pe mounted hain — isliye yahan sirf "/category" chahiye
const BASE = "/category";

// Image bhejni hai isliye JSON nahi, FormData banani padegi
function buildFormData(input: Partial<CategoryFormInput>): FormData {
  const formData = new FormData();

  if (input.name !== undefined) formData.append("name", input.name);
  if (input.status !== undefined) formData.append("status", input.status);
  if (input.image) formData.append("image", input.image);

  return formData;
}

export const categoryService = {
  /* ---------------- PUBLIC (website) ---------------- */

  // Homepage cards ke liye — sirf active categories
  async getActive(): Promise<Category[]> {
    const { data } = await api.get<CategoryListResponse>(`${BASE}/active`);
    return data.categories;
  },

  // Dynamic route — user category pe click kare to uske products
  async getBySlug(slug: string): Promise<CategoryWithProducts> {
    const { data } = await api.get<CategoryWithProducts>(`${BASE}/slug/${slug}`);
    return data;
  },

  /* ---------------- ADMIN (dashboard) ---------------- */

  // Sari categories — active + inactive dono
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<CategoryListResponse>(BASE);
    return data.categories;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<CategorySingleResponse>(`${BASE}/${id}`);
    return data.category;
  },

  async create(input: CategoryFormInput): Promise<Category> {
    const { data } = await api.post<CategoryMutationResponse>(
      BASE,
      buildFormData(input),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.category;
  },

  async update(id: string, input: Partial<CategoryFormInput>): Promise<Category> {
    const { data } = await api.put<CategoryMutationResponse>(
      `${BASE}/${id}`,
      buildFormData(input),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.category;
  },

  async remove(id: string): Promise<void> {
    await api.delete<DeleteResponse>(`${BASE}/${id}`);
  },
};