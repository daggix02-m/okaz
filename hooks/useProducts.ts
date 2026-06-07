import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useProducts(args?: { category?: string; storeId?: string; featured?: boolean }) {
  return useQuery(api.products.list, args ?? {});
}

export function useSearchProducts(query: string) {
  return useQuery(api.products.search, query ? { query } : "skip" as any);
}

export function useProduct(productId?: string) {
  return useQuery(api.products.getById, productId ? { productId: productId as any } : "skip" as any);
}
