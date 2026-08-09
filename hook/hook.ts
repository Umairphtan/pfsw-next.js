"use client";

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { brandService } from "@/services/brand";
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
  ApiErrorResponse,
} from "@/types/brand";

interface UseBrandsReturn {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
  createBrand: (payload: CreateBrandPayload) => Promise<Brand | null>;
  updateBrand: (id: string, payload: UpdateBrandPayload) => Promise<Brand | null>;
  deleteBrand: (id: string) => Promise<boolean>;
}

const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    return data?.message ?? "Something went wrong";
  }
  return "Something went wrong";
};

export function useBrands(): UseBrandsReturn {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createBrand = useCallback(async (payload: CreateBrandPayload): Promise<Brand | null> => {
    setError(null);
    try {
      const newBrand = await brandService.create(payload);
      setBrands((prev) => [newBrand, ...prev]);
      return newBrand;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    }
  }, []);

  const updateBrand = useCallback(
    async (id: string, payload: UpdateBrandPayload): Promise<Brand | null> => {
      setError(null);
      try {
        const updated = await brandService.update(id, payload);
        setBrands((prev) => prev.map((b) => (b._id === id ? updated : b)));
        return updated;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      }
    },
    []
  );

  const deleteBrand = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await brandService.remove(id);
      setBrands((prev) => prev.filter((b) => b._id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, error, fetchBrands, createBrand, updateBrand, deleteBrand };
}