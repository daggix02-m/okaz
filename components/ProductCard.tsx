import { View, TouchableOpacity, Text } from "react-native";
import { Heart, ShoppingCart, Star } from "lucide-react-native";
import { colors, spacing, radius, typography } from "@/lib/design-tokens";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/stores/cart.store";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Doc } from "@/convex/_generated/dataModel";

type Product = Doc<"products">;

export function ProductCard({ product }: { product: Product }) {
  const toggleFav = useMutation(api.favorites.toggleProductFavorite);
  const addToCart = useCartStore((s) => s.addItem);

  return (
    <View
      style={{
        backgroundColor: colors.light.background,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.light.border,
        overflow: "hidden",
        marginBottom: spacing.md,
      }}
    >
      {/* Image */}
      <TouchableOpacity
        onPress={() => router.push(`/store/${product.storeId}`)}
        accessibilityLabel={`View ${product.name}`}
        style={{
          height: 140,
          backgroundColor: colors.light.surface,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 40 }}>📦</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.light.text,
            lineHeight: 18,
          }}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Rating */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ fontSize: 11, fontWeight: "600", color: colors.light.text }}>
            {product.rating}
          </Text>
          <Text style={{ fontSize: 10, color: colors.light.textTertiary }}>
            ({product.reviewCount})
          </Text>
        </View>

        {/* Price & Actions */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xs }}>
          <View>
            <Text style={{ fontSize: 9, color: colors.light.textTertiary, textTransform: "uppercase", fontWeight: "700" }}>
              Price
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.light.text, fontVariant: ["tabular-nums"] }}>
              {product.price.toLocaleString()} ETB
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: spacing.xs, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                toggleFav({ productId: product._id });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{ padding: spacing.xs, minWidth: 36, minHeight: 36, justifyContent: "center", alignItems: "center" }}
              accessibilityLabel="Toggle favorite"
            >
              <Heart size={16} color={colors.light.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                addToCart(product);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                backgroundColor: colors.light.accent,
                borderRadius: radius.sm,
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
              accessibilityLabel={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
