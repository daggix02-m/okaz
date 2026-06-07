import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Store, CheckCircle } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";

export default function AdminApprovals() {
  const insets = useSafeAreaInsets();
  const stores = useQuery(api.stores.listApproved);
  const approveStore = useMutation(api.stores.approve);
  const toggleFeatured = useMutation(api.stores.toggleFeatured);

  // For now, show all stores (both approved and pending would come from separate queries)
  const allStores = stores ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Store Approvals
        </Text>
      </View>

      {!stores ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} height={80} />)}
        </View>
      ) : allStores.length === 0 ? (
        <EmptyState icon={<Store size={48} color={colors.light.textTertiary} />} title="No stores registered" message="New store registrations will appear here." />
      ) : (
        <FlatList
          data={allStores}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg, backgroundColor: colors.light.surface, borderRadius: radius.sm, marginBottom: spacing.xs }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 13 }}>{item.name}</Text>
                <Text style={{ fontSize: 11, color: colors.light.textSecondary }}>{item.locationName}</Text>
                <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }}>
                  <Text style={{ fontSize: 10, color: item.subscriptionActive ? colors.light.accent : colors.light.destructive }}>
                    {item.subscriptionActive ? "Active" : "Suspended"}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.light.textTertiary }}>
                    Month {item.subscriptionMonth}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: spacing.xs }}>
                {!item.isApproved && (
                  <TouchableOpacity
                    onPress={() => { approveStore({ storeId: item._id }); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
                    style={{ backgroundColor: colors.light.accent, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36, justifyContent: "center" }}
                    accessibilityLabel={`Approve ${item.name}`}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 11 }}>Approve</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => toggleFeatured({ storeId: item._id })}
                  style={{ backgroundColor: item.isFeatured ? "#FEF3C7" : colors.light.borderLight, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36, justifyContent: "center" }}
                  accessibilityLabel={`Toggle featured for ${item.name}`}
                >
                  <Text style={{ fontWeight: "700", fontSize: 11, color: item.isFeatured ? "#92400E" : colors.light.textSecondary }}>
                    {item.isFeatured ? "Featured" : "Promote"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
