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

const ROLES = [
  { id: "customer", label: "Customer", icon: "shopping-bag" },
  { id: "vendor", label: "Vendor", icon: "store" },
  { id: "delivery", label: "Delivery", icon: "bike" },
  { id: "admin", label: "Admin", icon: "shield" },
] as const;

export default function SignUp() {
  const { signIn } = useAuthActions();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("name", name.trim());
      formData.append("role", role);
      formData.append("flow", "signUp");
      await signIn("password", formData as any);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/");
    } catch (e: any) {
      setError(e?.message || "Sign up failed");
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
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
              color: colors.light.text,
              textAlign: "center",
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: typography.caption.fontSize,
              color: colors.light.textSecondary,
              textAlign: "center",
              marginTop: spacing.xs,
            }}
          >
            Join OKAZ marketplace
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
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              textContentType="name"
              autoComplete="name"
              accessibilityLabel="Full name"
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
              placeholder="At least 8 characters"
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
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

          <View>
            <Text
              style={{
                fontSize: typography.caption.fontSize,
                fontWeight: "600",
                color: colors.light.text,
                marginBottom: spacing.xs,
              }}
            >
              I am a...
            </Text>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setRole(r.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={r.label}
                  accessibilityState={{ selected: role === r.id }}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    borderRadius: radius.sm,
                    borderWidth: 2,
                    borderColor: role === r.id ? colors.light.primary : colors.light.border,
                    backgroundColor: role === r.id ? colors.light.primaryLight : colors.light.background,
                    alignItems: "center",
                    minHeight: 48,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: role === r.id ? "700" : "500",
                      color: role === r.id ? colors.light.primary : colors.light.textSecondary,
                    }}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Create account"
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel="Sign in instead"
              style={{ alignItems: "center", padding: spacing.xs }}
            >
              <Text
                style={{
                  fontSize: typography.caption.fontSize,
                  color: colors.light.primary,
                  fontWeight: "600",
                }}
              >
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
