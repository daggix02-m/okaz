import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TrendingUp, DollarSign, Package, Percent } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminRevenue() {
  const insets = useSafeAreaInsets();
  const stores = useQuery(api.stores.listApproved);
  const riders = useQuery(api.riders.list);

  const totalSales = stores?.reduce((sum, s) => sum + s.salesVolume, 0) ?? 0;
  const totalStores = stores?.length ?? 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Revenue
        </Text>
      </View>

      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        {!stores ? (
          <Skeleton height={120} />
        ) : (
          <>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
                <Store size={20} color={colors.light.primary} />
                <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>{totalStores}</Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Stores</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
                <Package size={20} color={colors.light.accent} />
                <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>{totalSales}</Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Total Sales</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
                <Users size={20} color="#D97706" />
                <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>{riders?.length ?? 0}</Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Riders</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
                <Percent size={20} color="#DC2626" />
                <Text style={{ fontSize: 20, fontWeight: "700", marginTop: spacing.sm }}>12%</Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Commission</Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg }}>
              <Text style={{ fontWeight: "700", fontSize: 13, marginBottom: spacing.md }}>Top Stores by Sales</Text>
              {stores.slice(0, 5).map((s, i) => (
                <View key={s._id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.light.borderLight }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Text style={{ fontWeight: "700", color: colors.light.textTertiary, minWidth: 20 }}>{i + 1}</Text>
                    <Text style={{ fontSize: 13, fontWeight: "600" }} numberOfLines={1}>{s.name}</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"] }}>{s.salesVolume}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
