import { View, Text } from "react-native";
import { Package, Percent, Store, Users } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";

export default function AdminRevenue() {
  const { colors } = useTheme();
  const stores = useQuery(api.stores.listApproved);
  const riders = useQuery(api.riders.list);

  const totalSales = stores?.reduce((sum, s) => sum + s.salesVolume, 0) ?? 0;
  const totalStores = stores?.length ?? 0;

  return (
    <Screen>
      <ScreenHeader title="Revenue" />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="gap-6">
          {!stores ? (
            <Skeleton height={120} />
          ) : (
            <>
              <View className="flex-row gap-3">
                <View className="flex-1 items-center rounded-xl bg-surface p-4">
                  <Store size={20} color={colors.primary} />
                  <Text className="mt-2 font-['Montserrat_700Bold'] text-xl font-bold text-foreground tabular-nums">
                    {totalStores}
                  </Text>
                  <Text className="font-['Montserrat_500Medium'] text-[10px] text-muted-foreground">Stores</Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-surface p-4">
                  <Package size={20} color={colors.accent} />
                  <Text className="mt-2 font-['Montserrat_700Bold'] text-xl font-bold text-foreground tabular-nums">
                    {totalSales}
                  </Text>
                  <Text className="font-['Montserrat_500Medium'] text-[10px] text-muted-foreground">Total Sales</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 items-center rounded-xl bg-surface p-4">
                  <Users size={20} color={colors.chart4} />
                  <Text className="mt-2 font-['Montserrat_700Bold'] text-xl font-bold text-foreground tabular-nums">
                    {riders?.length ?? 0}
                  </Text>
                  <Text className="font-['Montserrat_500Medium'] text-[10px] text-muted-foreground">Riders</Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-surface p-4">
                  <Percent size={20} color={colors.destructive} />
                  <Text className="mt-2 font-['Montserrat_700Bold'] text-xl font-bold text-foreground">12%</Text>
                  <Text className="font-['Montserrat_500Medium'] text-[10px] text-muted-foreground">Commission</Text>
                </View>
              </View>

              <View className="rounded-xl bg-surface p-4">
                <Text className="mb-3 font-['Montserrat_700Bold'] text-[13px] font-bold text-foreground">
                  Top Stores by Sales
                </Text>
                {stores.slice(0, 5).map((s, i) => (
                  <View key={s._id} className="flex-row justify-between border-b border-border py-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="min-w-5 font-['Montserrat_700Bold'] font-bold text-muted-foreground">
                        {i + 1}
                      </Text>
                      <Text className="font-['Montserrat_500Medium'] text-[13px] font-medium text-foreground" numberOfLines={1}>
                        {s.name}
                      </Text>
                    </View>
                    <Text className="font-['Montserrat_700Bold'] font-mono text-[13px] font-bold text-foreground">
                      {s.salesVolume}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScreenScrollView>
    </Screen>
  );
}
