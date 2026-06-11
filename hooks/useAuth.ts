import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGuestStore } from "@/stores/guest.store";

export function useCurrentUser() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const isGuest = useGuestStore((s) => s.isGuest);

  return {
    isLoading: isGuest ? false : (isLoading || (isAuthenticated && user === null)),
    isAuthenticated: isAuthenticated && user !== null,
    isGuest: isGuest && !(isAuthenticated && user !== null),
    user: user ?? null,
  };
}
