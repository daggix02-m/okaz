import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useTheme } from "@/hooks/useTheme";
import { useEntranceAnimation, useFadeAnimation } from "@/hooks/useEntranceAnimation";
import { AnimatedBackground } from "@/components/auth/AnimatedBackground";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { SocialButton } from "@/components/auth/SocialButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useGuestStore } from "@/stores/guest.store";
import * as Haptics from "expo-haptics";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const { top, bottom } = useScreenInsets();
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const setGuest = useGuestStore((s) => s.setGuest);
  const exitGuest = useGuestStore((s) => s.exitGuest);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const logoAnim = useEntranceAnimation({ duration: 500 });
  const emailAnim = useEntranceAnimation({ delay: 80, duration: 400 });
  const passwordAnim = useEntranceAnimation({ delay: 160, duration: 400 });
  const btnAnim = useEntranceAnimation({ delay: 240, duration: 400 });
  const dividerAnim = useFadeAnimation({ delay: 350, duration: 400 });
  const socialAnim = useEntranceAnimation({ delay: 400, duration: 400 });
  const footerAnim = useFadeAnimation({ delay: 550, duration: 400 });

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email");
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }
    return valid;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("flow", "signIn");
      await signIn("password", formData as any);
      exitGuest();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/");
    } catch (e: any) {
      const msg = e?.message || "Sign in failed";
      setError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    setGuest();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/");
  };

  const content = (
    <>
      <Animated.View
        style={[
          {
            opacity: logoAnim.opacity,
            transform: [{ scale: logoAnim.scale }],
          },
        ]}
        className="items-center mb-8"
      >
        <Text
          style={{ color: colors.foreground }}
          className="text-[40px] tracking-[12px] font-[Montserrat_700Bold] ml-[12px]"
        >
          OKAZ
        </Text>
        <Animated.View
          style={{
            height: 1,
            backgroundColor: isDark ? "rgba(255,255,255,0.6)" : "rgba(76,79,105,0.3)",
            borderRadius: 1,
            marginTop: 12,
            opacity: logoAnim.opacity,
            width: logoAnim.scale.interpolate({
              inputRange: [0.95, 1],
              outputRange: [0, 40],
              extrapolate: "clamp",
            }),
          }}
        />
        <Text className="text-[12px] text-muted-foreground mt-4 font-[Montserrat_500Medium] tracking-[2px] opacity-80 uppercase">
          Welcome back
        </Text>
      </Animated.View>
      {error ? (
        <Animated.View
          accessibilityRole="alert"
          className="bg-destructive/10 rounded-xl p-3 mb-6 border-l-[3px] border-destructive"
        >
          <Text className="text-destructive text-[12px] font-[Montserrat_500Medium]">
            {error}
          </Text>
        </Animated.View>
      ) : null}
      <View className="gap-4">
        <Animated.View
          style={{
            opacity: emailAnim.opacity,
            transform: [{ translateY: emailAnim.translateY }],
          }}
        >
          <AuthInput
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailError("");
              setError("");
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            error={emailError}
            accessibilityLabel="Email address"
          />
        </Animated.View>
        <Animated.View
          style={{
            opacity: passwordAnim.opacity,
            transform: [{ translateY: passwordAnim.translateY }],
          }}
        >
          <AuthInput
            label="Password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setPasswordError("");
              setError("");
            }}
            placeholder="Enter your password"
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            error={passwordError}
            accessibilityLabel="Password"
          />
        </Animated.View>
        <Animated.View
          style={{
            opacity: btnAnim.opacity,
            transform: [{ scale: btnAnim.scale }],
          }}
          className="gap-4 mt-3"
        >
          <AuthButton label="Sign In" onPress={handleSignIn} loading={loading} />
          <TouchableOpacity
            onPress={handleGuestSignIn}
            style={{
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: "transparent",
            }}
            className="rounded-xl min-h-[50px] justify-center items-center"
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue as Guest"
          >
            <Text
              style={{ color: colors.primary }}
              className="text-base font-bold font-[Montserrat_700Bold]"
            >
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          { opacity: dividerAnim.opacity },
        ]}
        className="flex-row items-center gap-3 my-8"
      >
        <View className="flex-1 h-px" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(76,79,105,0.15)" }} />
        <Text className="text-[11px] text-muted-foreground font-[Montserrat_500Medium] uppercase tracking-tighter opacity-80">
          or continue with
        </Text>
        <View className="flex-1 h-px" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(76,79,105,0.15)" }} />
      </Animated.View>
      <Animated.View
        style={[
          {
            opacity: socialAnim.opacity,
            transform: [{ translateY: socialAnim.translateY }],
          },
        ]}
        className="gap-4"
      >
        <SocialButton provider="google" />
        <SocialButton provider="apple" />
      </Animated.View>
      <Animated.View
        style={[
          { opacity: footerAnim.opacity },
        ]}
        className="items-center mt-10"
      >
        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-up")}
          accessibilityRole="link"
          accessibilityLabel="Create an account"
          activeOpacity={0.6}
          className="py-2"
        >
          <Text
            style={{ color: colors.foreground }}
            className="text-[12px] font-[Montserrat_600SemiBold] tracking-wide"
          >
            <Text className="text-muted-foreground opacity-80">Don't have an account?</Text>{" "}
            <Text style={{ color: colors.primary }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      <View className="absolute right-4 z-10" style={{ top: top + 15 }}>
        <ThemeToggle size={22} />
      </View>
      {Platform.OS === "web" ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: top + 70,
            paddingBottom: bottom + 40,
          }}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
        <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: top + 70,
              paddingBottom: bottom + 40,
            }}
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
