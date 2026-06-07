import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bike } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminFleet() {
  const insets = useSafeAreaInsets();
  const riders = useQuery(api.riders.list);

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Fleet
        </Text>
      </View>

      {!riders ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2].map((i) => <Skeleton key={i} height={80} />)}
        </View>
      ) : (
        <FlatList
          data={riders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg, backgroundColor: colors.light.surface, borderRadius: radius.sm, marginBottom: spacing.xs }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <Bike size={24} color={colors.light.primary} />
                <View>
                  <Text style={{ fontWeight: "700", fontSize: 13 }}>{item.vehicleType}</Text>
                  <Text style={{ fontSize: 11, color: colors.light.textSecondary }}>Plate: {item.plateNumber}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontWeight: "700", fontSize: 13, fontVariant: ["tabular-nums"] }}>
                  {item.totalEarnings.toLocaleString()} ETB
                </Text>
                <View style={{ backgroundColor: item.status === "idle" ? colors.light.accentLight : "#FEF3C7", paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 9999, marginTop: spacing.xs }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: item.status === "idle" ? colors.light.accent : "#92400E" }}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
