import { View } from "react-native";
import { Package } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useOrders } from "@/hooks/useOrders";
import { useCurrentUser } from "@/hooks/useAuth";
import { OrderCard } from "@/components/OrderCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { router } from "expo-router";

export default function CustomerOrders() {
  const { colors } = useTheme();
  const { isGuest } = useCurrentUser();
  const orders = useOrders();

  return (
    <Screen>
      <ScreenHeader title="My Orders" right={<ThemeToggle />} />

      {isGuest ? (
        <EmptyState
          icon={<Package size={48} color={colors.mutedForeground} />}
          title="Sign in to view orders"
          message="Create an account or sign in to track your orders."
          action={{ label: "Sign In", onPress: () => router.push("/(auth)/sign-in") }}
        />
      ) : !orders ? (
        <View className="gap-3 p-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={160} />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} color={colors.mutedForeground} />}
          title="No orders yet"
          message="Items you order from merchants will appear here."
          action={{ label: "Start Shopping", onPress: () => router.push("/(customer)") }}
        />
      ) : (
        <ScreenFlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}
    </Screen>
  );
}
