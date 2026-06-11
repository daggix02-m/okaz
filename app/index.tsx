import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useCurrentUser } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function Index() {
  const { isLoading, isAuthenticated, isGuest, user } = useCurrentUser();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isGuest) {
    return <Redirect href="/(customer)" />;
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
