import { Tabs, Redirect } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { LayoutDashboard, Package, ShoppingBag, Settings } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarScreenOptions } from "@/lib/tab-bar-options";

export default function VendorLayout() {
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
  if (user?.role !== "vendor") return <Redirect href="/" />;

  return (
    <Tabs screenOptions={getTabBarScreenOptions(colors, insets)}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused, color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused, color, size }) => <Package size={size} color={color} fill={focused ? color : "transparent"} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ focused, color, size }) => <ShoppingBag size={size} color={color} fill={focused ? color : "transparent"} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
