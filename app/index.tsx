import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useCurrentUser } from "@/hooks/useAuth";
import { colors, typography } from "@/lib/design-tokens";

export default function Index() {
  const { isLoading, isAuthenticated, user } = useCurrentUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.light.background }}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Redirect to role-based home
  switch (user?.role) {
    case "vendor":
      return <Redirect href="/(vendor)" />;
    case "delivery":
      return <Redirect href="/(delivery)" />;
    case "admin":
      return <Redirect href="/(admin)" />;
    default:
      return <Redirect href="/(customer)" />;
  }
}
