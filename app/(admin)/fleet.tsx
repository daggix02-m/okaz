import { View, Text } from "react-native";
import { Bike } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";

export default function AdminFleet() {
  const { colors } = useTheme();
  const riders = useQuery(api.riders.list);

  return (
    <Screen>
      <ScreenHeader title="Fleet" />

      {!riders ? (
        <View className="gap-3 p-4">
          {[1, 2].map((i) => <Skeleton key={i} height={80} />)}
        </View>
      ) : (
        <ScreenFlatList
          data={riders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="mb-1 flex-row items-center justify-between rounded-lg bg-surface p-4">
              <View className="flex-row items-center gap-3">
                <Bike size={24} color={colors.primary} />
                <View>
                  <Text className="font-['Montserrat_700Bold'] text-[13px] font-bold text-foreground">
                    {item.vehicleType}
                  </Text>
                  <Text className="font-['Montserrat_500Medium'] text-[11px] text-muted-foreground">
                    Plate: {item.plateNumber}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="font-['Montserrat_700Bold'] text-[13px] font-bold text-foreground tabular-nums">
                  {item.totalEarnings.toLocaleString()} ETB
                </Text>
                <View
                  style={{ backgroundColor: item.status === "idle" ? colors.accentLight : colors.warningLight }}
                  className="mt-1 rounded-full px-2 py-1"
                >
                  <Text
                    style={{ color: item.status === "idle" ? colors.accent : colors.warning }}
                    className="font-['Montserrat_700Bold'] text-[10px] font-bold"
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}
