import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error("EXPO_PUBLIC_CONVEX_URL is not set");
}

export const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={AsyncStorage}
      replaceURL={(url) => {
        // Handle OAuth redirect on web — clear the URL search params
        if (typeof window !== "undefined") {
          const parsed = new URL(url, window.location.origin);
          window.history.replaceState({}, "", parsed.pathname);
        }
      }}
    >
      {children}
    </ConvexAuthProvider>
  );
}

