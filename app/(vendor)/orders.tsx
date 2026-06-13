import { View, Text, TouchableOpacity } from "react-native";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import { getStatusColor } from "@/lib/design-tokens";
import { useTheme } from "@/hooks/useTheme";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMyStores } from "@/hooks/useStores";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import * as Haptics from "expo-haptics";
import { Package } from "lucide-react-native";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function VendorOrders() {
  const { colors } = useTheme();
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
    <Screen>
      <ScreenHeader title="Orders" right={<ThemeToggle size={20} />} />

      {!orders ? (
        <View className="p-4 gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={120} />)}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState icon={<Package size={48} color={colors.mutedForeground} />} title="No orders yet" message="Orders from customers will appear here." />
      ) : (
        <ScreenFlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const statusColor = getStatusColor(item.status, colors);
            return (
              <View className="bg-card rounded-xl border border-border p-4 mb-3">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs font-semibold text-foreground tabular-nums">{item.orderId}</Text>
                  <View style={{ backgroundColor: statusColor.bg }} className="px-2 py-1 rounded-full">
                    <Text style={{ color: statusColor.text }} className="text-[10px] font-bold uppercase">{item.status}</Text>
                  </View>
                </View>
                {item.items.slice(0, 3).map((i, idx) => (
                  <Text key={idx} className="text-[13px] text-foreground">{i.name} x{i.quantity}</Text>
                ))}
                <Text className="text-[13px] font-bold text-foreground mt-2 tabular-nums">
                  Total: {item.total.toLocaleString()} ETB
                </Text>

                {/* Actions */}
                <View className="flex-row gap-2 mt-3">
                  {item.status === "pending" && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "confirmed")} className="bg-primary rounded-lg px-4 py-2 min-h-[40px] justify-center">
                      <Text className="text-primary-foreground font-bold text-xs">Approve</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "confirmed" && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "packed")} className="bg-accent rounded-lg px-4 py-2 min-h-[40px] justify-center">
                      <Text className="text-accent-foreground font-bold text-xs">Mark Packed</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "packed" && riders && riders.length > 0 && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "assigned", riders[0].userId)} className="bg-primary rounded-lg px-4 py-2 min-h-[40px] justify-center">
                      <Text className="text-primary-foreground font-bold text-xs">Assign Rider</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "on_the_way" && (
                    <TouchableOpacity onPress={() => handleUpdate(item._id, "delivered")} className="bg-accent rounded-lg px-4 py-2 min-h-[40px] justify-center">
                      <Text className="text-accent-foreground font-bold text-xs">Mark Delivered</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </Screen>
  );
}
