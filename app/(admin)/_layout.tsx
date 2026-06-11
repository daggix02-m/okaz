import { Tabs, Redirect } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { Store, Users, TrendingUp, Layers } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarScreenOptions } from "@/lib/tab-bar-options";

export default function AdminLayout() {
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
  if (user?.role !== "admin") return <Redirect href="/" />;

  return (
    <Tabs screenOptions={getTabBarScreenOptions(colors, insets)}>
      <Tabs.Screen name="index" options={{ title: "Approvals", tabBarIcon: ({ focused, color, size }) => <Store size={size} color={color} fill={focused ? color : "transparent"} /> }} />
      <Tabs.Screen name="fleet" options={{ title: "Fleet", tabBarIcon: ({ focused, color, size }) => <Users size={size} color={color} /> }} />
      <Tabs.Screen name="revenue" options={{ title: "Revenue", tabBarIcon: ({ focused, color, size }) => <TrendingUp size={size} color={color} /> }} />
      <Tabs.Screen name="content" options={{ title: "Content", tabBarIcon: ({ focused, color, size }) => <Layers size={size} color={color} /> }} />
    </Tabs>
  );
}
