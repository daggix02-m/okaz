import { View, Text, TouchableOpacity } from "react-native";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import { Bike, MapPin } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";

export default function DeliveryJobs() {
  const { colors } = useTheme();
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
    <Screen>
      <ScreenHeader
        title="Delivery Jobs"
        subtitle={
          currentRider
            ? `${currentRider.vehicleType} · ${currentRider.plateNumber}`
            : undefined
        }
      />

      {!pendingOrders ? (
        <View className="p-4 gap-3">
          {[1, 2].map((i) => <Skeleton key={i} height={140} />)}
        </View>
      ) : allJobs.length === 0 ? (
        <EmptyState icon={<Bike size={48} color={colors.mutedForeground} />} title="No jobs available" message="Orders needing delivery will appear here." />
      ) : (
        <ScreenFlatList
          data={allJobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="bg-card rounded-xl border border-border p-4 mb-3">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-[13px] text-foreground">{item.orderId}</Text>
                <View className="bg-warning-light px-2 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-warning">{item.deliveryFee} ETB</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2 mb-1">
                <MapPin size={14} color={colors.accent} />
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>Pickup: Store</Text>
              </View>
              <View className="flex-row items-center gap-2 mb-2">
                <MapPin size={14} color={colors.destructive} />
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>Drop: {item.deliveryAddress}</Text>
              </View>

              <View className="flex-row gap-2 mt-2">
                {item.status === "packed" && !item.riderId && (
                  <TouchableOpacity onPress={() => handleAcceptJob(item._id)} className="bg-warning rounded-lg px-4 py-2 min-h-[40px] justify-center" accessibilityLabel="Accept delivery job">
                    <Text className="text-warning-foreground font-bold text-xs">Accept Job</Text>
                  </TouchableOpacity>
                )}
                {item.status === "assigned" && (
                  <TouchableOpacity onPress={() => handleAction(item._id, "on_the_way")} className="bg-primary rounded-lg px-4 py-2 min-h-[40px] justify-center" accessibilityLabel="Mark picked up">
                    <Text className="text-primary-foreground font-bold text-xs">Pick Up</Text>
                  </TouchableOpacity>
                )}
                {item.status === "on_the_way" && (
                  <TouchableOpacity onPress={() => handleAction(item._id, "delivered")} className="bg-accent rounded-lg px-4 py-2 min-h-[40px] justify-center" accessibilityLabel="Mark delivered">
                    <Text className="text-accent-foreground font-bold text-xs">Delivered</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}
