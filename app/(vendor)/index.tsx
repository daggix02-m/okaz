import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Users, Package, Star, TrendingUp, ChevronRight } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useMyStores } from "@/hooks/useStores";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

export default function VendorDashboard() {
  const insets = useSafeAreaInsets();
  const stores = useMyStores();
  const activeStore = stores?.[0];

  const vendorOrders = useQuery(api.orders.getByStore, activeStore ? { storeId: activeStore._id } : "skip" as any);
  const vendorProducts = useQuery(api.products.list, activeStore ? { storeId: activeStore._id } : "skip" as any);
  const reviews = useQuery(api.reviews.getByTarget, activeStore ? { targetType: "store", targetId: activeStore._id } : "skip" as any);

  const deliveredOrders = vendorOrders?.filter((o) => o.status === "delivered") ?? [];
  const revenue = deliveredOrders.reduce((sum, o) => sum + o.subtotal, 0);

  if (!stores || !activeStore) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.light.background, paddingTop: insets.top, padding: spacing.lg }}>
        <Skeleton height={200} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          {activeStore.name}
        </Text>
        <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary, marginTop: spacing.xs }}>
          {activeStore.locationName}
        </Text>
      </View>

      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        {/* Stats */}
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
            <Users size={20} color={colors.light.primary} />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>
              {activeStore.salesVolume}
            </Text>
            <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Sold</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
            <Package size={20} color={colors.light.accent} />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>
              {vendorOrders?.length ?? 0}
            </Text>
            <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Orders</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>
              {revenue.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>ETB Rev</Text>
          </View>
        </View>

        {/* Products */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
            <Text style={{ fontWeight: "700", fontSize: 13, color: colors.light.text }}>
              Listed Products ({vendorProducts?.length ?? 0})
            </Text>
            <TouchableOpacity onPress={() => router.push("/(vendor)/products")} accessibilityLabel="View all products">
              <ChevronRight size={18} color={colors.light.primary} />
            </TouchableOpacity>
          </View>
          {(vendorProducts ?? []).slice(0, 5).map((p) => (
            <View key={p._id} style={{ flexDirection: "row", justifyContent: "space-between", padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.sm, marginBottom: spacing.xs }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", fontSize: 13 }} numberOfLines={1}>{p.name}</Text>
                <Text style={{ fontSize: 11, color: colors.light.textSecondary }}>Stock: {p.stock} · Sold: {p.salesCount}</Text>
              </View>
              <Text style={{ fontWeight: "700", color: colors.light.text, fontVariant: ["tabular-nums"] }}>
                {p.price.toLocaleString()} ETB
              </Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <View>
            <Text style={{ fontWeight: "700", fontSize: 13, color: colors.light.text, marginBottom: spacing.md }}>
              Recent Reviews
            </Text>
            {reviews.slice(0, 5).map((r) => (
              <View key={r._id} style={{ padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.sm, marginBottom: spacing.xs }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "600", fontSize: 12 }}>{r.authorName}</Text>
                  <View style={{ flexDirection: "row", gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} color={s <= r.rating ? "#F59E0B" : colors.light.border} fill={s <= r.rating ? "#F59E0B" : "transparent"} />
                    ))}
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: colors.light.textSecondary, marginTop: spacing.xs }}>"{r.text}"</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
