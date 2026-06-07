import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, radius, statusColors } from "@/lib/design-tokens";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMyStores } from "@/hooks/useStores";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";
import { Package } from "lucide-react-native";

export default function VendorOrders() {
  const insets = useSafeAreaInsets();
  const stores = useMyStores();
  const activeStore = stores?.[0];
  const orders = useQuery(api.orders.getByStore, activeStore ? { storeId: activeStore._id } : "skip" as any);
  const riders = useQuery(api.riders.getAvailable);
  const updateStatus = useMutation(api.orders.updateStatus);

  const handleUpdate = (orderId: string, status: any, riderId?: string) => {
    updateStatus({ orderId: orderId as any, status, riderId: riderId as any });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Orders
        </Text>
      </View>

      {!orders ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} height={120} />)}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState icon={<Package size={48} color={colors.light.textTertiary} />} title="No orders yet" message="Orders from customers will appear here." />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => {
            const statusColor = statusColors[item.status] || statusColors.pending;
            return (
              <View style={{ backgroundColor: colors.light.background, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border, padding: spacing.lg, marginBottom: spacing.md }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", fontVariant: ["tabular-nums"] }}>{item.orderId}</Text>
                  <View style={{ backgroundColor: statusColor.bg, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 9999 }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: statusColor.text, textTransform: "uppercase" }}>{item.status}</Text>
                  </View>
                </View>
                {item.items.slice(0, 3).map((i, idx) => (
                  <Text key={idx} style={{ fontSize: 13, color: colors.light.text }}>{i.name} x{i.quantity}</Text>
                ))}
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.light.text, marginTop: spacing.sm, fontVariant: ["tabular-nums"] }}>
                  Total: {item.total.toLocaleString()} ETB
                </Text>

                {/* Actions */}
                <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
                  {item.status === "pending" && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "confirmed")} style={{ backgroundColor: colors.light.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }}>
                      <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Approve</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "confirmed" && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "packed")} style={{ backgroundColor: colors.light.accent, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }}>
                      <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Mark Packed</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "packed" && riders && riders.length > 0 && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "assigned", riders[0].userId)} style={{ backgroundColor: "#4F46E5", borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }}>
                      <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Assign Rider</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "on_the_way" && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "delivered")} style={{ backgroundColor: colors.light.accent, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }}>
                      <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Mark Delivered</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
