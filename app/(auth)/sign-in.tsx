import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import * as Haptics from "expo-haptics";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("flow", "signIn");
      await signIn("password", formData as any);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      setError(e?.message || "Sign in failed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.light.background }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.xl,
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: spacing.xxxl }}>
          <Text
            style={{
              fontSize: typography.h1.fontSize,
              fontWeight: typography.h1.fontWeight,
              color: colors.light.text,
              textAlign: "center",
            }}
          >
            OKAZ
          </Text>
          <Text
            style={{
              fontSize: typography.caption.fontSize,
              color: colors.light.textSecondary,
              textAlign: "center",
              marginTop: spacing.xs,
            }}
          >
            Sign in to your account
          </Text>
        </View>

        {error ? (
          <View
            style={{
              backgroundColor: colors.light.destructiveLight,
              padding: spacing.md,
              borderRadius: radius.sm,
              marginBottom: spacing.lg,
            }}
            accessibilityRole="alert"
          >
            <Text style={{ color: colors.light.destructive, fontSize: typography.caption.fontSize }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: spacing.lg }}>
          <View>
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontWeight: "600",
                color: colors.light.text,
                marginBottom: spacing.xs,
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              accessibilityLabel="Email address"
              style={{
                backgroundColor: colors.light.surface,
                borderWidth: 1,
                borderColor: colors.light.border,
                borderRadius: radius.sm,
                padding: spacing.md,
                fontSize: typography.body.fontSize,
                color: colors.light.text,
                minHeight: 48,
              }}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontWeight: "600",
                color: colors.light.text,
                marginBottom: spacing.xs,
              }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              accessibilityLabel="Password"
              style={{
                backgroundColor: colors.light.surface,
                borderWidth: 1,
                borderColor: colors.light.border,
                borderRadius: radius.sm,
                padding: spacing.md,
                fontSize: typography.body.fontSize,
                color: colors.light.text,
                minHeight: 48,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            style={{
              backgroundColor: colors.light.primary,
              borderRadius: radius.sm,
              padding: spacing.md,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: typography.body.fontSize,
                  fontWeight: "700",
                }}
              >
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel="Create an account"
              style={{ alignItems: "center", padding: spacing.xs }}
            >
              <Text
                style={{
                  fontSize: typography.caption.fontSize,
                  color: colors.light.primary,
                  fontWeight: "600",
                }}
              >
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
