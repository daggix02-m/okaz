import "@/global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ConvexClientProvider } from "@/lib/convex";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { useThemeStore } from "@/stores/theme.store";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { FiraCode_400Regular } from "@expo-google-fonts/fira-code";
import { WebMobileShell } from "@/components/WebMobileShell";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";
import { useColorScheme } from "nativewind";

function AppContent() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(customer)" />
      <Stack.Screen name="(vendor)" />
      <Stack.Screen name="(delivery)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen
        name="store/[id]"
        options={{
          headerShown: true,
          title: "Store",
          presentation: "card",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontFamily: "Montserrat_700Bold",
            fontSize: 17,
          },
          headerShadowVisible: false,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}

function Shell() {
  const mode = useThemeStore((s) => s.mode);
  const resolvedFn = useThemeStore((s) => s.resolved);
  const { setColorScheme } = useColorScheme();

  // Derive the current resolved string so React can track changes
  const resolvedTheme = resolvedFn();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setColorScheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <WebMobileShell>
        <View style={{ flex: 1 }}>
          <AppContent />
        </View>
      </WebMobileShell>
    </>
  );
}

function LoadingScreen() {
  const { colors } = useTheme();
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    FiraCode_400Regular,
  });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ConvexClientProvider>
          <Shell />
        </ConvexClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
