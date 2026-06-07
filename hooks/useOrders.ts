import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useOrders() {
  return useQuery(api.orders.getByCustomer);
}

export function useStoreOrders(storeId?: string) {
  return useQuery(api.orders.getByStore, storeId ? { storeId: storeId as any } : "skip" as any);
}

export function useRiderOrders() {
  return useQuery(api.orders.getByRider);
}

export function usePendingOrders() {
  return useQuery(api.orders.getPending);
}
