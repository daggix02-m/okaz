import { Tabs, Redirect } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { Package, Map, DollarSign } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarScreenOptions } from "@/lib/tab-bar-options";

export default function DeliveryLayout() {
  const { isLoading, isAuthenticated, user } = useCurrentUser();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  if (user?.role !== "delivery") return <Redirect href="/" />;

  return (
    <Tabs screenOptions={getTabBarScreenOptions(colors, insets)}>
      <Tabs.Screen name="index" options={{ title: "Jobs", tabBarIcon: ({ focused, color, size }) => <Package size={size} color={color} fill={focused ? color : "transparent"} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ focused, color, size }) => <Map size={size} color={color} /> }} />
      <Tabs.Screen name="earnings" options={{ title: "Earnings", tabBarIcon: ({ focused, color, size }) => <DollarSign size={size} color={color} /> }} />
    </Tabs>
  );
}
