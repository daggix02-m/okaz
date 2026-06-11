import { useState } from "react";
import type { ReactNode } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
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
import { RoleSelector } from "@/components/auth/RoleSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useGuestStore } from "@/stores/guest.store";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import * as Haptics from "expo-haptics";

function AuthWrapper({ children }: { children: ReactNode }) {
  const { top, bottom } = useScreenInsets();

  if (Platform.OS === "web") {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: top + 40,
          paddingBottom: bottom + 32,
        }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: top + 40,
          paddingBottom: bottom + 32,
        }}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const { colors } = useTheme();

  const getStrength = (
    pw: string
  ): { score: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const labels = ["Weak", "Fair", "Good", "Strong"];
    const barColors = [
      colors.destructive,
      colors.chart4,
      colors.chart3,
      colors.chart3,
    ];
    return {
      score,
      label: labels[Math.min(score, 3)] ?? "",
      color: barColors[Math.min(score, 3)] ?? colors.destructive,
    };
  };

  const { score, label, color } = getStrength(password);

  if (!password) return null;

  return (
    <View className="flex-row items-center gap-2 px-1 mt-1.5">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="flex-1 h-1 rounded-[2px]"
          style={{ backgroundColor: i <= score ? color : colors.border }}
        />
      ))}
      <Text className="text-[10px] font-semibold" style={{ color, minWidth: 36 }}>
        {label}
      </Text>
    </View>
  );
}

export default function SignUp() {
  const { signIn } = useAuthActions();
  const { top } = useScreenInsets();
  const { colors } = useTheme();
  const setGuest = useGuestStore((s) => s.setGuest);
  const exitGuest = useGuestStore((s) => s.exitGuest);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("customer");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const logoAnim = useEntranceAnimation({ duration: 500 });
  const nameAnim = useEntranceAnimation({ delay: 80, duration: 400 });
  const emailAnim = useEntranceAnimation({ delay: 160, duration: 400 });
  const pwAnim = useEntranceAnimation({ delay: 240, duration: 400 });
  const roleAnim = useEntranceAnimation({ delay: 320, duration: 400 });
  const refAnim = useEntranceAnimation({ delay: 380, duration: 400 });
  const btnAnim = useEntranceAnimation({ delay: 440, duration: 400 });
  const dividerAnim = useFadeAnimation({ delay: 520, duration: 400 });
  const socialAnim = useEntranceAnimation({ delay: 560, duration: 400 });
  const footerAnim = useFadeAnimation({ delay: 640, duration: 400 });

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    }
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
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("name", name.trim());
      formData.append("role", role);
      if (referralCode.trim())
        formData.append("referralCode", referralCode.trim());
      formData.append("flow", "signUp");
      await signIn("password", formData as any);
      exitGuest();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/");
    } catch (e: any) {
      const msg = e?.message || "Sign up failed";
      setError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      <View className="absolute right-4 z-10" style={{ top: top + 8 }}>
        <ThemeToggle size={22} />
      </View>
      <AuthWrapper>
        <View>
          <Animated.View
            style={[
              {
                opacity: logoAnim.opacity,
                transform: [{ scale: logoAnim.scale }],
              },
            ]}
            className="items-center mb-7"
          >
            <Text className="text-display text-foreground tracking-[4px] font-[Montserrat_700Bold]">
              OKAZ
            </Text>
              <Animated.View
              style={{
                height: 3,
                backgroundColor: colors.primary,
                borderRadius: 2,
                marginTop: 6,
                opacity: logoAnim.opacity,
                width: logoAnim.scale.interpolate({
                  inputRange: [0.95, 1],
                  outputRange: [0, 40],
                  extrapolate: "clamp",
                }),
              }}
            />
            <Text className="text-[13px] text-muted-foreground mt-2.5 font-[Montserrat_500Medium]">
              Create your account
            </Text>
          </Animated.View>
          {error ? (
            <Animated.View
              accessibilityRole="alert"
              className="bg-destructive-light rounded-xl p-3 mb-4 border-l-[3px]"
              style={{ borderLeftColor: colors.destructive }}
            >
              <Text className="text-destructive text-[13px] font-[Montserrat_500Medium]">
                {error}
              </Text>
            </Animated.View>
          ) : null}
          <View className="gap-3">
            <Animated.View
              style={{
                opacity: nameAnim.opacity,
                transform: [{ translateY: nameAnim.translateY }],
              }}
            >
              <AuthInput
                label="Full Name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setNameError("");
                }}
                placeholder="John Doe"
                textContentType="name"
                autoComplete="name"
                autoCapitalize="words"
                error={nameError}
                accessibilityLabel="Full name"
              />
            </Animated.View>
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
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                error={emailError}
                accessibilityLabel="Email address"
              />
            </Animated.View>
            <View>
              <Animated.View
                style={{
                  opacity: pwAnim.opacity,
                  transform: [{ translateY: pwAnim.translateY }],
                }}
              >
                <AuthInput
                  label="Password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setPasswordError("");
                  }}
                  placeholder="Min. 8 characters"
                  secureTextEntry
                  textContentType="newPassword"
                  autoComplete="new-password"
                  error={passwordError}
                  accessibilityLabel="Password"
                />
              </Animated.View>
              <PasswordStrength password={password} />
            </View>
            <Animated.View
              style={{
                opacity: roleAnim.opacity,
                transform: [{ translateY: roleAnim.translateY }],
              }}
            >
              <Text className="text-xs font-semibold text-foreground mb-1.5 ml-1 font-[Montserrat_600SemiBold]">
                I am a...
              </Text>
              <RoleSelector value={role} onChange={setRole} />
            </Animated.View>
            <Animated.View
              style={{
                opacity: refAnim.opacity,
                transform: [{ translateY: refAnim.translateY }],
              }}
            >
              <TouchableOpacity
                onPress={() => setShowReferral(!showReferral)}
                activeOpacity={0.6}
                className="flex-row items-center gap-1.5 py-1 min-h-[44px]"
                accessibilityLabel="Add referral code"
              >
                {showReferral ? (
                  <ChevronUp size={16} color={colors.mutedForeground} />
                ) : (
                  <ChevronDown size={16} color={colors.mutedForeground} />
                )}
                <Text className="text-xs text-muted-foreground font-[Montserrat_500Medium]">
                  Have a referral code?
                </Text>
              </TouchableOpacity>
              {showReferral ? (
                <RNTextInput
                  value={referralCode}
                  onChangeText={setReferralCode}
                  placeholder="Enter referral code"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="characters"
                  accessibilityLabel="Referral code"
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground font-mono min-h-[48px] mt-1"
                />
              ) : null}
            </Animated.View>
            <Animated.View
              style={{
                opacity: btnAnim.opacity,
                transform: [{ scale: btnAnim.scale }],
              }}
            >
              <AuthButton
                label="Create Account"
                onPress={handleSignUp}
                loading={loading}
              />
            </Animated.View>
          </View>
          <Animated.View
            style={[
              { opacity: dividerAnim.opacity },
            ]}
            className="flex-row items-center gap-3 my-5"
          >
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            <Text className="text-xs text-muted-foreground font-[Montserrat_500Medium]">
              or continue with
            </Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          </Animated.View>
          <Animated.View
            style={[
              {
                opacity: socialAnim.opacity,
                transform: [{ translateY: socialAnim.translateY }],
              },
            ]}
            className="gap-2.5"
          >
            <SocialButton provider="google" />
            <SocialButton provider="apple" />
          </Animated.View>
          <Animated.View
            style={[
              { opacity: footerAnim.opacity },
            ]}
            className="items-center mt-5 gap-3.5"
          >
            <TouchableOpacity
              onPress={() => {
                setGuest();
                router.replace("/(customer)");
              }}
              accessibilityRole="button"
              accessibilityLabel="Continue as guest"
              activeOpacity={0.6}
              className="justify-center min-h-[44px]"
              style={{ padding: 8 }}
            >
              <Text className="text-sm text-muted-foreground font-[Montserrat_600SemiBold]">
                Continue as Guest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              accessibilityRole="link"
              accessibilityLabel="Sign in instead"
              activeOpacity={0.6}
              className="justify-center"
              style={{ padding: 8 }}
            >
              <Text className="text-[13px] text-primary font-[Montserrat_600SemiBold]">
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </AuthWrapper>
    </View>
  );
}
