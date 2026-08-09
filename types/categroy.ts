// ============================================================
// Category types — aapke backend Category model se match karti hain
// ============================================================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  image: string;
  imagePublicId: string;
  createdAt: string;
  updatedAt: string;
}

// Public dynamic route (GET /category/slug/:slug) ka response —
// category ke sath uske products bhi aate hain
export interface CategoryWithProducts {
  success: boolean;
  category: Category;
  products: unknown[]; // apna Product type bante hi yahan use kar lein
}

// ---------------- API response shapes ----------------

export interface CategoryListResponse {
  success: boolean;
  categories: Category[];
  fromCache?: boolean;
}

export interface CategorySingleResponse {
  success: boolean;
  category: Category;
}

export interface CategoryMutationResponse {
  success: boolean;
  message: string;
  category: Category;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// ---------------- Form input (create/update ke liye) ----------------

export interface CategoryFormInput {
  name: string;
  status: "active" | "inactive";
  image?: File | null; // naya image select kiya ho to, warna null/undefined
}