import { Platform, TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import { useGuestStore } from "@/stores/guest.store";
import { router } from "expo-router";

type SocialProvider = "google" | "apple";

const ICONS: Record<SocialProvider, string> = {
  google: "G",
  apple: "\uF8FF",
};

const LABELS: Record<SocialProvider, string> = {
  google: "Continue with Google",
  apple: "Continue with Apple",
};

export function SocialButton({ provider }: { provider: SocialProvider }) {
  const { colors, theme } = useTheme();
  const { signIn } = useAuthActions();
  const exitGuest = useGuestStore((s) => s.exitGuest);
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";

  const bgColor =
    provider === "google"
      ? colors.card
      : isDark
        ? colors.surfaceElevated
        : colors.foreground;

  const textColor =
    provider === "google"
      ? colors.foreground
      : isDark
        ? colors.foreground
        : colors.background;

  const borderColor = provider === "google" ? colors.border : "transparent";

  const handlePress = useCallback(async () => {
    if (Platform.OS === "ios" && provider === "apple") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setLoading(true);
    try {
      await signIn(provider);
      exitGuest();
      router.replace("/");
    } catch {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [provider, signIn, exitGuest]);

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={LABELS[provider]}
        activeOpacity={0.7}
        style={{
          backgroundColor: bgColor,
          borderColor,
          boxShadow: colors.shadow,
        }}
        className="flex-row items-center justify-center border rounded-xl min-h-[50px] px-5 gap-3"
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            <Text
              style={{ color: textColor, fontWeight: "600", fontFamily: "Montserrat_600SemiBold" }}
              className="text-lg"
            >
              {ICONS[provider]}
            </Text>
            <Text
              style={{ color: textColor, fontWeight: "600", fontFamily: "Montserrat_600SemiBold" }}
              className="text-sm"
            >
              {LABELS[provider]}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
