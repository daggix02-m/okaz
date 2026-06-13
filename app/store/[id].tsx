import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Screen, ScreenFlatList } from "@/components/ui/Screen";
import { Star, MapPin, ArrowLeft, Heart } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useStore } from "@/hooks/useStores";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGuestStore } from "@/stores/guest.store";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { getResolvedStoreImage } from "@/lib/image-helper";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function StoreDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const store = useStore(id);
  const products = useQuery(api.products.list, { storeId: id as any });
  const toggleFav = useMutation(api.favorites.toggleStoreFavorite);
  const isGuest = useGuestStore((s) => s.isGuest);
  const storeFavIds = useQuery(api.favorites.getStoreFavorites, isGuest ? "skip" : {});
  const isFavorited = storeFavIds?.includes(id as any) ?? false;

  if (!store) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Skeleton height={200} width={300} />
      </View>
    );
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTitle: store.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="-ml-2"
              style={{ padding: 8 }}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={22} color={colors.foreground} />
            </TouchableOpacity>
          ),
          headerRight: () => <ThemeToggle size={20} />,
        }}
      />

      <ScreenFlatList
        data={products ?? []}
        keyExtractor={(item) => item._id}
        numColumns={2}
        withTabBar={false}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 12 }}
        ListHeaderComponent={
          <View className="mb-6">
            {/* Store Header */}
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-16 h-16 rounded-xl bg-surface overflow-hidden border border-border">
                <Image
                  source={{ uri: getResolvedStoreImage(store) }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Star size={12} color={colors.chart4} fill={colors.chart4} />
                  <Text className="font-semibold text-[11px] text-foreground">{store.rating}</Text>
                  <Text className="text-[10px] text-muted-foreground">
                    ({store.reviewCount} reviews)
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 mt-1">
                  <MapPin size={12} color={colors.mutedForeground} />
                  <Text className="text-xs text-muted-foreground">{store.locationName}</Text>
                </View>
                {store.isSponsored && (
                  <View className="mt-1 bg-warning-light px-2 py-0.5 rounded self-start">
                    <Text className="text-[9px] font-bold text-warning">Sponsored</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (isGuest) {
                    router.push("/(auth)/sign-in");
                    return;
                  }
                  toggleFav({ storeId: store._id });
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="justify-center items-center min-w-[48px] min-h-[48px]"
                style={{ padding: 8 }}
                accessibilityLabel="Toggle store favorite"
              >
                <Heart size={22} color={isFavorited ? colors.primary : colors.mutedForeground} fill={isFavorited ? colors.primary : "transparent"} />
              </TouchableOpacity>
            </View>

            <Text className="font-bold text-xs text-foreground uppercase tracking-[1px] mb-3">
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
          <View className="p-6 items-center">
            <Text className="text-muted-foreground">No products listed yet</Text>
          </View>
        }
      />
    </Screen>
  );
}
