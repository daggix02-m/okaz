import { Tabs, Redirect } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { Store, Users, TrendingUp, Layers } from "lucide-react-native";
import { colors } from "@/lib/design-tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminLayout() {
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
  if (user?.role !== "admin") return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DC2626",
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
      <Tabs.Screen name="index" options={{ title: "Approvals", tabBarIcon: ({ color, size }) => <Store size={size} color={color} /> }} />
      <Tabs.Screen name="fleet" options={{ title: "Fleet", tabBarIcon: ({ color, size }) => <Users size={size} color={color} /> }} />
      <Tabs.Screen name="revenue" options={{ title: "Revenue", tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} /> }} />
      <Tabs.Screen name="content" options={{ title: "Content", tabBarIcon: ({ color, size }) => <Layers size={size} color={color} /> }} />
    </Tabs>
  );
}
