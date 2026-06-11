import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
          role: params.role as string,
        };
      },
    }),
    Google({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name ?? profile.email.split("@")[0],
          role: "customer",
        };
      },
    }),
    Apple({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name ?? "Apple User",
          role: "customer",
        };
      },
    }),
  ],
});
