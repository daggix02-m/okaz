import { View, Text } from "react-native";
import { Heart } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/useAuth";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { router } from "expo-router";

export default function CustomerFavorites() {
  const { colors } = useTheme();
  const { isGuest } = useCurrentUser();
  const productFavIds = useQuery(api.favorites.getProductFavorites, isGuest ? "skip" : {});
  const storeFavIds = useQuery(api.favorites.getStoreFavorites, isGuest ? "skip" : {});
  const products = useQuery(api.products.list, {});
  const stores = useQuery(api.stores.listApproved, {});

  const favProducts = products?.filter((p) => productFavIds?.includes(p._id)) ?? [];
  const favStores = stores?.filter((s) => storeFavIds?.includes(s._id)) ?? [];
  const isLoading = productFavIds === undefined || storeFavIds === undefined;

  return (
    <Screen>
      <ScreenHeader title="Favorites" right={<ThemeToggle />} />

      {isGuest ? (
        <EmptyState
          icon={<Heart size={48} color={colors.mutedForeground} />}
          title="Sign in to save favorites"
          message="Create an account or sign in to save your favorite products and stores."
          action={{ label: "Sign In", onPress: () => router.push("/(auth)/sign-in") }}
        />
      ) : isLoading ? (
        <View className="gap-3 p-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={220} />)}
        </View>
      ) : favProducts.length === 0 && favStores.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} color={colors.mutedForeground} />}
          title="No favorites yet"
          message="Tap the heart icon on products and stores to save them here."
          action={{ label: "Browse Products", onPress: () => router.push("/(customer)") }}
        />
      ) : (
        <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="gap-6">
            {favStores.length > 0 && (
              <View>
                <Text className="mb-3 font-['Montserrat_700Bold'] text-label uppercase tracking-widest text-muted-foreground">
                  Saved Stores ({favStores.length})
                </Text>
                {favStores.map((store) => (
                  <StoreCard
                    key={store._id}
                    store={store}
                    onPress={() => router.push(`/store/${store._id}`)}
                  />
                ))}
              </View>
            )}
            {favProducts.length > 0 && (
              <View>
                <Text className="mb-3 font-['Montserrat_700Bold'] text-label uppercase tracking-widest text-muted-foreground">
                  Saved Products ({favProducts.length})
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {favProducts.map((p) => (
                    <View key={p._id} className="flex-1" style={{ minWidth: "45%", maxWidth: "50%" }}>
                      <ProductCard product={p} isFavorited />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScreenScrollView>
      )}
    </Screen>
  );
}
