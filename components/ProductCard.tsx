import { View, TouchableOpacity, Text } from "react-native";
import { Heart, ShoppingCart, Star } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/stores/cart.store";
import { useGuestStore } from "@/stores/guest.store";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Doc } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { getProductImage } from "@/lib/image-helper";

type Product = Doc<"products">;

export function ProductCard({ product, isFavorited }: { product: Product; isFavorited?: boolean }) {
  const { colors } = useTheme();
  const toggleFav = useMutation(api.favorites.toggleProductFavorite);
  const addToCart = useCartStore((s) => s.addItem);
  const isGuest = useGuestStore((s) => s.isGuest);
  const favorited = isFavorited ?? false;

  return (
    <View className="bg-card border border-border rounded-xl overflow-hidden mb-3">
      {/* Product Image */}
      <TouchableOpacity
        onPress={() => router.push(`/store/${product.storeId}`)}
        accessibilityLabel={`View ${product.name}`}
        className="h-[140px] overflow-hidden bg-surface relative"
      >
        <Image
          source={{ uri: getProductImage(product.name, product.category) }}
          className="w-full h-full"
          contentFit="cover"
          transition={200}
        />
        {/* Subtle glass gradient overlay at the bottom */}
        <View className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
      </TouchableOpacity>

      {/* Content */}
      <View className="p-3 gap-2">
        <Text
          className="leading-[18px] text-[13px] font-semibold text-card-foreground font-['Montserrat_600SemiBold']"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center gap-1">
          <Star size={12} color={colors.chart4} fill={colors.chart4} />
          <Text className="font-semibold text-[11px] text-card-foreground">
            {product.rating}
          </Text>
          <Text className="text-[10px] text-muted-foreground">
            ({product.reviewCount})
          </Text>
        </View>

        {/* Price & Actions */}
        <View className="flex-row justify-between items-center mt-1">
          <View>
            <Text className="uppercase font-bold text-[9px] text-muted-foreground">
              Price
            </Text>
            <Text className="font-bold text-sm text-card-foreground tabular-nums">
              {product.price.toLocaleString()} ETB
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => {
                if (isGuest) {
                  router.push("/(auth)/sign-in");
                  return;
                }
                toggleFav({ productId: product._id });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="items-center justify-center w-9 h-9"
              accessibilityLabel="Toggle favorite"
            >
              <Heart size={18} color={favorited ? colors.primary : colors.mutedForeground} fill={favorited ? colors.primary : "transparent"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                addToCart(product);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="items-center justify-center rounded-lg bg-accent w-9 h-9"
              accessibilityLabel={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={18} color={colors.accentForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
