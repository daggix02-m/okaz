import { View, Text, TouchableOpacity } from "react-native";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";
import { Users, Package, Star, TrendingUp, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useMyStores } from "@/hooks/useStores";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { router } from "expo-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function VendorDashboard() {
  const { colors } = useTheme();
  const stores = useMyStores();
  const activeStore = stores?.[0];

  const vendorOrders = useQuery(api.orders.getByStore, activeStore ? { storeId: activeStore._id } : "skip" as any);
  const vendorProducts = useQuery(api.products.list, activeStore ? { storeId: activeStore._id } : "skip" as any);
  const reviews = useQuery(api.reviews.getByTarget, activeStore ? { targetType: "store", targetId: activeStore._id } : "skip" as any);

  const deliveredOrders = vendorOrders?.filter((o) => o.status === "delivered") ?? [];
  const revenue = deliveredOrders.reduce((sum, o) => sum + o.subtotal, 0);

  if (!stores || !activeStore) {
    return (
      <Screen>
        <ScreenHeader title="Dashboard" right={<ThemeToggle size={20} />} />
        <View className="p-4">
          <Skeleton height={200} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title={activeStore.name}
        subtitle={activeStore.locationName}
        right={<ThemeToggle size={20} />}
      />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
      <View className="gap-6">
        {/* Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-xl p-4 items-center">
            <Users size={20} color={colors.primary} />
            <Text className="text-xl font-bold text-foreground mt-2 tabular-nums">
              {activeStore.salesVolume}
            </Text>
            <Text className="text-[10px] text-muted-foreground">Sold</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 items-center">
            <Package size={20} color={colors.accent} />
            <Text className="text-xl font-bold text-foreground mt-2 tabular-nums">
              {vendorOrders?.length ?? 0}
            </Text>
            <Text className="text-[10px] text-muted-foreground">Orders</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 items-center">
            <TrendingUp size={20} color={colors.chart4} />
            <Text className="text-xl font-bold text-foreground mt-2 tabular-nums">
              {revenue.toLocaleString()}
            </Text>
            <Text className="text-[10px] text-muted-foreground">ETB Rev</Text>
          </View>
        </View>

        {/* Products */}
        <View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-xs text-foreground">
              Listed Products ({vendorProducts?.length ?? 0})
            </Text>
            <TouchableOpacity onPress={() => router.push("/(vendor)/products")} accessibilityLabel="View all products">
              <ChevronRight size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {(vendorProducts ?? []).slice(0, 5).map((p) => (
            <View key={p._id} className="flex-row justify-between p-3 bg-surface rounded-lg mb-1">
              <View className="flex-1">
                <Text className="font-semibold text-[13px] text-foreground" numberOfLines={1}>{p.name}</Text>
                <Text className="text-[11px] text-muted-foreground">Stock: {p.stock} · Sold: {p.salesCount}</Text>
              </View>
              <Text className="font-bold text-foreground tabular-nums">
                {p.price.toLocaleString()} ETB
              </Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <View>
            <Text className="font-bold text-xs text-foreground mb-3">
              Recent Reviews
            </Text>
            {reviews.slice(0, 5).map((r) => (
              <View key={r._id} className="p-3 bg-surface rounded-lg mb-1">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-xs text-foreground">{r.authorName}</Text>
                  <View className="flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} color={s <= r.rating ? colors.chart4 : colors.border} fill={s <= r.rating ? colors.chart4 : "transparent"} />
                    ))}
                  </View>
                </View>
                <Text className="text-xs text-muted-foreground mt-1">"{r.text}"</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      </ScreenScrollView>
    </Screen>
  );
}
