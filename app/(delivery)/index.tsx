import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bike, MapPin } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";

export default function DeliveryJobs() {
  const insets = useSafeAreaInsets();
  const { user } = useCurrentUser();
  const pendingOrders = useQuery(api.orders.getPending);
  const riderOrders = useQuery(api.orders.getByRider);
  const currentRider = useQuery(api.riders.getCurrentRider);
  const updateStatus = useMutation(api.orders.updateStatus);
  const assignRider = useMutation(api.orders.assignRider);

  const allJobs = [
    ...(pendingOrders?.filter((o) => !o.riderId) ?? []),
    ...(riderOrders?.filter((o) => o.riderId && o.status !== "delivered") ?? []),
  ];

  const handleAcceptJob = async (orderId: string) => {
    if (!user) return;
    try {
      await assignRider({ orderId: orderId as any, riderId: user._id });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleAction = (orderId: string, status: any) => {
    updateStatus({ orderId: orderId as any, status });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Delivery Jobs
        </Text>
        {currentRider && (
          <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary, marginTop: spacing.xs }}>
            {currentRider.vehicleType} · {currentRider.plateNumber}
          </Text>
        )}
      </View>

      {!pendingOrders ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2].map((i) => <Skeleton key={i} height={140} />)}
        </View>
      ) : allJobs.length === 0 ? (
        <EmptyState icon={<Bike size={48} color={colors.light.textTertiary} />} title="No jobs available" message="Orders needing delivery will appear here." />
      ) : (
        <FlatList
          data={allJobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: colors.light.background, borderRadius: radius.md, borderWidth: 1, borderColor: colors.light.border, padding: spacing.lg, marginBottom: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                <Text style={{ fontWeight: "700", fontSize: 13 }}>{item.orderId}</Text>
                <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 9999 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: "#92400E" }}>{item.deliveryFee} ETB</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                <MapPin size={14} color={colors.light.accent} />
                <Text style={{ fontSize: 12, color: colors.light.textSecondary }} numberOfLines={1}>Pickup: {item.storeName ?? "Store"}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
                <MapPin size={14} color={colors.light.destructive} />
                <Text style={{ fontSize: 12, color: colors.light.textSecondary }} numberOfLines={1}>Drop: {item.deliveryAddress}</Text>
              </View>

              <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
                {item.status === "packed" && !item.riderId && (
                  <TouchableOpacity onPress={() => handleAcceptJob(item._id)} style={{ backgroundColor: "#D97706", borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }} accessibilityLabel="Accept delivery job">
                    <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Accept Job</Text>
                  </TouchableOpacity>
                )}
                {item.status === "assigned" && (
                  <TouchableOpacity onPress={() => handleAction(item._id, "on_the_way")} style={{ backgroundColor: colors.light.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }} accessibilityLabel="Mark picked up">
                    <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Pick Up</Text>
                  </TouchableOpacity>
                )}
                {item.status === "on_the_way" && (
                  <TouchableOpacity onPress={() => handleAction(item._id, "delivered")} style={{ backgroundColor: colors.light.accent, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 40, justifyContent: "center" }} accessibilityLabel="Mark delivered">
                    <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12 }}>Delivered</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
