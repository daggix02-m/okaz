import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Package } from "lucide-react-native";
import { colors, typography, spacing, statusColors } from "@/lib/design-tokens";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/OrderCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { router } from "expo-router";

export default function CustomerOrders() {
  const insets = useSafeAreaInsets();
  const orders = useOrders();

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          My Orders
        </Text>
      </View>

      {!orders ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={160} />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} color={colors.light.textTertiary} />}
          title="No orders yet"
          message="Items you order from merchants will appear here."
          action={{ label: "Start Shopping", onPress: () => router.push("/(customer)") }}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}
    </View>
  );
}
