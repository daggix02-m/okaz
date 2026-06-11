import { View, Text } from "react-native";
import { Banknote, TrendingUp } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";

export default function DeliveryEarnings() {
  const { colors } = useTheme();
  const rider = useQuery(api.riders.getCurrentRider);
  const orders = useQuery(api.orders.getByRider);
  const completedOrders = orders?.filter((o) => o.status === "delivered") ?? [];
  const todayEarnings = completedOrders.reduce((sum, o) => sum + o.deliveryFee, 0);

  return (
    <Screen>
      <ScreenHeader title="Earnings" />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="gap-6">
          {rider ? (
            <>
              <View className="items-center rounded-xl bg-accent-light p-6">
                <Banknote size={24} color={colors.accent} />
                <Text className="mt-2 font-['Montserrat_700Bold'] text-3xl font-bold text-foreground tabular-nums">
                  {rider.totalEarnings.toLocaleString()} ETB
                </Text>
                <Text className="font-['Montserrat_500Medium'] text-caption text-muted-foreground">
                  Total Earnings
                </Text>
              </View>
              <View className="items-center rounded-xl bg-surface p-6">
                <TrendingUp size={24} color={colors.primary} />
                <Text className="mt-2 font-['Montserrat_700Bold'] text-2xl font-bold text-foreground tabular-nums">
                  {todayEarnings.toLocaleString()} ETB
                </Text>
                <Text className="font-['Montserrat_500Medium'] text-caption text-muted-foreground">
                  From {completedOrders.length} completed deliveries
                </Text>
              </View>
            </>
          ) : (
            <Skeleton height={120} />
          )}
        </View>
      </ScreenScrollView>
    </Screen>
  );
}
