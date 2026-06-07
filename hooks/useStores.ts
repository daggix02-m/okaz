import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useStores() {
  return useQuery(api.stores.listApproved);
}

export function useStore(storeId?: string) {
  return useQuery(api.stores.getById, storeId ? { storeId: storeId as any } : "skip" as any);
}

export function useMyStores() {
  return useQuery(api.stores.getByOwner);
}
