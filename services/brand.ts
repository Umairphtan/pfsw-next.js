import { api } from "../libs/axios";
import type {
  Brand,
  BrandListResponse,
  BrandSingleResponse,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@/types/brand";

const BASE_PATH = "/brand";

const buildFormData = (payload: CreateBrandPayload | UpdateBrandPayload): FormData => {
  const formData = new FormData();

  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.status !== undefined) formData.append("status", payload.status);
  if (payload.image) formData.append("image", payload.image);

  return formData;
};

export const brandService = {
  getAll: async (): Promise<Brand[]> => {
    const { data } = await api.get<BrandListResponse>(BASE_PATH);
    return data.brands;
  },

  getById: async (id: string): Promise<Brand> => {
    const { data } = await api.get<BrandSingleResponse>(`${BASE_PATH}/${id}`);
    return data.brand;
  },

 create: async (payload: CreateBrandPayload): Promise<Brand> => {
  const formData = buildFormData(payload);

  const { data } = await api.post<BrandSingleResponse>(BASE_PATH, formData, {
    headers: { "Content-Type": undefined }, // 👈 ye line add karo
  });
  return data.brand;
},

update: async (id: string, payload: UpdateBrandPayload): Promise<Brand> => {
  const formData = buildFormData(payload);

  const { data } = await api.put<BrandSingleResponse>(`${BASE_PATH}/${id}`, formData, {
    headers: { "Content-Type": undefined }, // 👈 yahan bhi
  });
  return data.brand;
},

  remove: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },
};