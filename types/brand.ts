export type BrandStatus = "active" | "inactive";

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  imagePublicId: string;
  status: BrandStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BrandListResponse {
  success: boolean;
  brands: Brand[];
}

export interface BrandSingleResponse {
  success: boolean;
  message?: string;
  brand: Brand;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface CreateBrandPayload {
  name: string;
  status?: BrandStatus;
  image?: File | null;
}

export interface UpdateBrandPayload {
  name?: string;
  status?: BrandStatus;
  image?: File | null;
}