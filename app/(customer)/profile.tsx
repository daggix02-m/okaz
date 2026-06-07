import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, LogOut, Gift, Share2 } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import * as Haptics from "expo-haptics";
import { useState } from "react";

export default function CustomerProfile() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuthActions();
  const { user } = useCurrentUser();
  const claimCoupon = useMutation(api.users.claimCoupon);
  const trackReferral = useMutation(api.users.trackReferral);
  const updateProfile = useMutation(api.users.updateProfile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [refCode, setRefCode] = useState("");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const handleClaimCoupon = async () => {
    try {
      await claimCoupon({});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "30% coupon claimed!");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to claim coupon");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, phone });
      setEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update profile");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Profile
        </Text>
      </View>

      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        {/* Profile Card */}
        <View style={{ backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: "center" }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.light.primaryLight, justifyContent: "center", alignItems: "center", marginBottom: spacing.md }}>
            <Text style={{ fontSize: 28 }}>🐼</Text>
          </View>
          {editing ? (
            <View style={{ width: "100%", gap: spacing.md }}>
              <TextInput
                value={name}
                onChangeText={setName}
                style={{
                  backgroundColor: colors.light.background,
                  borderWidth: 1,
                  borderColor: colors.light.border,
                  borderRadius: radius.sm,
                  padding: spacing.md,
                  fontSize: typography.body.fontSize,
                  color: colors.light.text,
                  minHeight: 48,
                }}
                placeholder="Name"
                accessibilityLabel="Edit name"
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={{
                  backgroundColor: colors.light.background,
                  borderWidth: 1,
                  borderColor: colors.light.border,
                  borderRadius: radius.sm,
                  padding: spacing.md,
                  fontSize: typography.body.fontSize,
                  color: colors.light.text,
                  minHeight: 48,
                }}
                placeholder="Phone"
                keyboardType="phone-pad"
                accessibilityLabel="Edit phone"
              />
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <TouchableOpacity
                  onPress={() => setEditing(false)}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    backgroundColor: colors.light.surface,
                    borderRadius: radius.sm,
                    borderWidth: 1,
                    borderColor: colors.light.border,
                    alignItems: "center",
                    minHeight: 48,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    backgroundColor: colors.light.primary,
                    borderRadius: radius.sm,
                    alignItems: "center",
                    minHeight: 48,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={{ fontSize: typography.h3.fontSize, fontWeight: typography.h3.fontWeight, color: colors.light.text }}>
                {user?.name}
              </Text>
              <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary, marginTop: spacing.xs }}>
                {user?.email}
              </Text>
              {user?.phone && (
                <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary }}>
                  {user.phone}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => setEditing(true)}
                style={{ marginTop: spacing.md }}
              >
                <Text style={{ color: colors.light.primary, fontWeight: "600" }}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Referral Card */}
        <View style={{ backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <Share2 size={20} color={colors.light.primary} />
            <Text style={{ fontWeight: "700", fontSize: typography.body.fontSize, color: colors.light.text }}>
              Refer a Friend
            </Text>
          </View>
          <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary, marginBottom: spacing.md }}>
            Get 20 referrals to unlock a 30% discount coupon! You have {user?.referralCount ?? 0}/20 referrals.
          </Text>
          <View style={{ backgroundColor: colors.light.borderLight, borderRadius: radius.sm, height: 4, overflow: "hidden", marginBottom: spacing.md }}>
            <View style={{ backgroundColor: colors.light.accent, height: "100%", width: `${Math.min(100, ((user?.referralCount ?? 0) / 20) * 100)}%` }} />
          </View>
          {user?.couponActive && (
            <TouchableOpacity
              onPress={handleClaimCoupon}
              style={{
                backgroundColor: "#D97706",
                borderRadius: radius.sm,
                padding: spacing.md,
                alignItems: "center",
                marginBottom: spacing.md,
                minHeight: 48,
                justifyContent: "center",
              }}
              accessibilityLabel="Claim 30% coupon"
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Gift size={16} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Claim 30% Coupon</Text>
              </View>
            </TouchableOpacity>
          )}
          <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
            <TextInput
              value={refCode}
              onChangeText={setRefCode}
              placeholder="Enter referral code"
              style={{
                flex: 1,
                backgroundColor: colors.light.background,
                borderWidth: 1,
                borderColor: colors.light.border,
                borderRadius: radius.sm,
                padding: spacing.md,
                fontSize: typography.body.fontSize,
                color: colors.light.text,
                minHeight: 48,
              }}
              accessibilityLabel="Referral code"
            />
            <TouchableOpacity
              onPress={() => {
                if (refCode.trim()) {
                  trackReferral({ referralCode: refCode });
                  setRefCode("");
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
              style={{
                backgroundColor: colors.light.primary,
                borderRadius: radius.sm,
                padding: spacing.md,
                minHeight: 48,
                minWidth: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.light.destructiveLight,
            borderRadius: radius.sm,
            minHeight: 48,
          }}
          accessibilityLabel="Logout"
          accessibilityRole="button"
        >
          <LogOut size={18} color={colors.light.destructive} />
          <Text style={{ color: colors.light.destructive, fontWeight: "700" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
