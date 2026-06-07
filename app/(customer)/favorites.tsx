import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";
import { colors, typography, spacing } from "@/lib/design-tokens";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { router } from "expo-router";

export default function CustomerFavorites() {
  const insets = useSafeAreaInsets();
  const productFavIds = useQuery(api.favorites.getProductFavorites);
  const storeFavIds = useQuery(api.favorites.getStoreFavorites);
  const products = useQuery(api.products.list);
  const stores = useQuery(api.stores.listApproved);

  const favProducts = products?.filter((p) => productFavIds?.includes(p._id)) ?? [];
  const favStores = stores?.filter((s) => storeFavIds?.includes(s._id)) ?? [];

  const isLoading = productFavIds === undefined || storeFavIds === undefined;

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Favorites
        </Text>
      </View>

      {isLoading ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={220} />)}
        </View>
      ) : favProducts.length === 0 && favStores.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} color={colors.light.textTertiary} />}
          title="No favorites yet"
          message="Tap the heart icon on products and stores to save them here."
          action={{ label: "Browse Products", onPress: () => router.push("/(customer)") }}
        />
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          ListHeaderComponent={
            <View style={{ gap: spacing.xl }}>
              {favStores.length > 0 && (
                <View>
                  <Text style={{ fontWeight: "700", textTransform: "uppercase", fontSize: typography.caption.fontSize, color: colors.light.textSecondary, letterSpacing: 1, marginBottom: spacing.md }}>
                    Saved Stores ({favStores.length})
                  </Text>
                  {favStores.map((store) => (
                    <StoreCard key={store._id} store={store} onPress={() => router.push(`/store/${store._id}`)} />
                  ))}
                </View>
              )}
              {favProducts.length > 0 && (
                <View>
                  <Text style={{ fontWeight: "700", textTransform: "uppercase", fontSize: typography.caption.fontSize, color: colors.light.textSecondary, letterSpacing: 1, marginBottom: spacing.md }}>
                    Saved Products ({favProducts.length})
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
                    {favProducts.map((p) => (
                      <View key={p._id} style={{ flex: 1, minWidth: "45%", maxWidth: "50%" }}>
                        <ProductCard product={p} />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}
