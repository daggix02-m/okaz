import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DollarSign, TrendingUp } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DeliveryEarnings() {
  const insets = useSafeAreaInsets();
  const rider = useQuery(api.riders.getCurrentRider);
  const orders = useQuery(api.orders.getByRider);
  const completedOrders = orders?.filter((o) => o.status === "delivered") ?? [];
  const todayEarnings = completedOrders.reduce((sum, o) => sum + o.deliveryFee, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Earnings
        </Text>
      </View>

      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        {/* Earnings Cards */}
        {rider ? (
          <>
            <View style={{ backgroundColor: colors.light.accentLight, borderRadius: radius.md, padding: spacing.xl, alignItems: "center" }}>
              <DollarSign size={24} color={colors.light.accent} />
              <Text style={{ fontSize: 28, fontWeight: "700", color: colors.light.text, marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>
                {rider.totalEarnings.toLocaleString()} ETB
              </Text>
              <Text style={{ fontSize: 12, color: colors.light.textSecondary }}>Total Earnings</Text>
            </View>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "700", fontVariant: ["tabular-nums"] }}>{todayEarnings.toLocaleString()}</Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Today</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "700", fontVariant: ["tabular-nums"] }}>{completedOrders.length}</Text>
                <Text style={{ fontSize: 10, color: colors.light.textSecondary }}>Delivered</Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg }}>
              <Text style={{ fontWeight: "700", marginBottom: spacing.md }}>Rating</Text>
              <Text style={{ fontSize: 24, fontWeight: "700", color: "#F59E0B" }}>{rider.rating} / 5.0</Text>
            </View>
          </>
        ) : (
          <Skeleton height={160} />
        )}
      </View>
    </ScrollView>
  );
}
