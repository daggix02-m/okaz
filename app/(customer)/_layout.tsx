import { Tabs, Redirect } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { ShoppingBag, Package, ShoppingCart, Heart, User } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarScreenOptions } from "@/lib/tab-bar-options";

export default function CustomerLayout() {
  const { isLoading, isAuthenticated, isGuest, user } = useCurrentUser();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isGuest) {
    // Guest can browse but auth-required tabs show sign-in prompts
  } else if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  } else if (user?.role !== "customer") {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={getTabBarScreenOptions(colors, insets)}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <ShoppingBag size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused, color, size }) => (
            <Package size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused, color, size }) => (
            <ShoppingCart size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused, color, size }) => (
            <Heart size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <User size={size} color={color} fill={focused ? color : "transparent"} />
          ),
        }}
      />
    </Tabs>
  );
}
