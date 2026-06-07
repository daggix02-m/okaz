import { Tabs, Redirect } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { View, ActivityIndicator, Text } from "react-native";
import { LayoutDashboard, Package, ShoppingBag, Settings } from "lucide-react-native";
import { colors } from "@/lib/design-tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VendorLayout() {
  const { isLoading, isAuthenticated, user } = useCurrentUser();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.light.background }}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  if (user?.role !== "vendor") return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.light.accent,
        tabBarInactiveTintColor: colors.light.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.light.background,
          borderTopColor: colors.light.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
