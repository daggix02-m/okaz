import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Star, MapPin, ArrowLeft } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useStore } from "@/hooks/useStores";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import * as Haptics from "expo-haptics";

export default function StoreDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore(id);
  const products = useQuery(api.products.list, { storeId: id as any });
  const toggleFav = useMutation(api.favorites.toggleStoreFavorite);

  if (!store) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.light.background }}>
        <Skeleton height={200} width={300} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <Stack.Screen
        options={{
          headerTitle: store.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: spacing.sm, marginLeft: -spacing.sm }}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={22} color={colors.light.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={products ?? []}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: spacing.md }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.xl }}>
            {/* Store Header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.light.surface, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.light.border }}>
                <Text style={{ fontSize: 32 }}>🏬</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={{ fontWeight: "600", fontSize: 13 }}>{store.rating}</Text>
                  <Text style={{ color: colors.light.textTertiary, fontSize: 11 }}>
                    ({store.reviewCount} reviews)
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs }}>
                  <MapPin size={12} color={colors.light.textSecondary} />
                  <Text style={{ fontSize: 12, color: colors.light.textSecondary }}>{store.locationName}</Text>
                </View>
                {store.isSponsored && (
                  <View style={{ marginTop: spacing.xs, backgroundColor: "#FEF3C7", paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" }}>
                    <Text style={{ fontSize: 9, fontWeight: "700", color: "#92400E" }}>Sponsored</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  toggleFav({ storeId: store._id });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{ padding: spacing.sm, minWidth: 48, minHeight: 48, justifyContent: "center", alignItems: "center" }}
                accessibilityLabel="Toggle store favorite"
              >
                <Star size={22} color={colors.light.primary} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontWeight: "700", fontSize: 13, color: colors.light.text, textTransform: "uppercase", letterSpacing: 1, marginBottom: spacing.md }}>
              Products
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: spacing.xl, alignItems: "center" }}>
            <Text style={{ color: colors.light.textSecondary }}>No products listed yet</Text>
          </View>
        }
      />
    </View>
  );
}
