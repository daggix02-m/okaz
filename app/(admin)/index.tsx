import { View, Text, TouchableOpacity } from "react-native";
import { Store } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import * as Haptics from "expo-haptics";

export default function AdminApprovals() {
  const { colors } = useTheme();
  const stores = useQuery(api.stores.listApproved);
  const approveStore = useMutation(api.stores.approve);
  const toggleFeatured = useMutation(api.stores.toggleFeatured);
  const allStores = stores ?? [];

  return (
    <Screen>
      <ScreenHeader title="Store Approvals" />

      {!stores ? (
        <View className="gap-3 p-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={80} />)}
        </View>
      ) : allStores.length === 0 ? (
        <EmptyState
          icon={<Store size={48} color={colors.mutedForeground} />}
          title="No stores registered"
          message="New store registrations will appear here."
        />
      ) : (
        <ScreenFlatList
          data={allStores}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="mb-2 flex-row items-center justify-between rounded-lg bg-surface p-4">
              <View className="flex-1">
                <Text className="font-['Montserrat_700Bold'] text-[13px] font-bold text-foreground">
                  {item.name}
                </Text>
                <Text className="font-['Montserrat_500Medium'] text-[11px] text-muted-foreground">
                  {item.locationName}
                </Text>
                <View className="mt-2 flex-row gap-2">
                  <Text style={{ fontSize: 10, color: item.subscriptionActive ? colors.accent : colors.destructive }}>
                    {item.subscriptionActive ? "Active" : "Suspended"}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.mutedForeground }}>
                    Month {item.subscriptionMonth}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-1">
                {!item.isApproved && (
                  <TouchableOpacity
                    onPress={() => {
                      approveStore({ storeId: item._id });
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }}
                    className="min-h-[36px] items-center justify-center rounded-lg bg-primary px-2 py-1.5"
                    accessibilityLabel={`Approve ${item.name}`}
                  >
                    <Text style={{ color: colors.primaryForeground, fontWeight: "700", fontSize: 11 }}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => toggleFeatured({ storeId: item._id })}
                  style={{ backgroundColor: item.isFeatured ? colors.warningLight : colors.borderLight }}
                  className="min-h-[36px] items-center justify-center rounded-lg px-2 py-1.5"
                  accessibilityLabel={`Toggle featured for ${item.name}`}
                >
                  <Text
                    style={{ color: item.isFeatured ? colors.warning : colors.mutedForeground }}
                    className="font-['Montserrat_700Bold'] text-[11px] font-bold"
                  >
                    {item.isFeatured ? "Featured" : "Promote"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}
