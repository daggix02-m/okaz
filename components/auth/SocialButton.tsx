import { Platform, TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import { useGuestStore } from "@/stores/guest.store";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

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

  const bgColor = isDark ? "#242432" : colors.card;
  const textColor = isDark ? "#ffffff" : colors.foreground;
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : colors.borderLight;

  const Icon = provider === "google" ? (
    <Text style={{ color: textColor, fontSize: 18, fontWeight: "bold" }}>G</Text>
  ) : (
    <View className="mb-1">
      <Text style={{ color: textColor, fontSize: 22 }}></Text>
    </View>
  );

  const handlePress = async () => {
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        await signIn(provider, { redirectTo: window.location.origin });
        return;
      }

      const redirectTo = makeRedirectUri({ scheme: "okaz" });
      const result = await signIn(provider, { redirectTo });

      if (result.redirect) {
        const authResult = await WebBrowser.openAuthSessionAsync(
          result.redirect.toString(),
          redirectTo
        );

        if (authResult.type === "success" && authResult.url) {
          const code = authResult.url.match(/[?&]code=([^&#]+)/)?.[1];
          if (code) {
            const signInResult = await signIn(provider, { code, redirectTo });
            if (signInResult.signingIn) {
              exitGuest();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace("/");
            }
          }
        }
      }
    } catch (error) {
      console.error("Social sign in error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

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
          borderWidth: 1,
        }}
        className="flex-row items-center justify-center rounded-xl min-h-[50px] px-5 gap-3"
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            {Icon}
            <Text
              style={{ color: textColor, fontWeight: "600", fontFamily: "Montserrat_600SemiBold" }}
              className="text-[13px]"
            >
              {LABELS[provider]}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
