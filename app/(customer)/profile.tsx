import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";
import { User, LogOut, Gift, Share2, CheckCircle, LogIn } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { router } from "expo-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function CustomerProfile() {
  const { colors } = useTheme();
  const { signOut } = useAuthActions();
  const { user, isGuest } = useCurrentUser();
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
    <Screen>
      <ScreenHeader title="Profile" right={<ThemeToggle />} />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
      {isGuest ? (
        <View className="gap-6">
          <View className="items-center rounded-xl bg-surface p-4">
            <View className="justify-center items-center w-16 h-16 rounded-full mb-3" style={{ backgroundColor: colors.primaryLight }}>
              <User size={28} color={colors.primary} />
            </View>
            <Text className="text-[18px] font-semibold leading-[24px] text-foreground font-['Montserrat_600SemiBold'] text-center">
              Sign in to unlock your profile
            </Text>
            <Text className="text-[12px] leading-[16px] text-muted-foreground font-['Montserrat_500Medium'] mt-2 text-center">
              Track orders, save favorites, earn referral rewards, and more.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              className="items-center justify-center mt-4 bg-primary rounded-lg p-3 min-h-[48px] w-full"
              accessibilityLabel="Sign in"
            >
              <View className="flex-row items-center gap-2">
                <LogIn size={18} color={colors.primaryForeground} />
                <Text className="text-primary-foreground font-bold font-['Montserrat_700Bold']">Sign In</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              className="items-center mt-2 p-2"
            >
              <Text className="text-primary font-semibold font-['Montserrat_600SemiBold']">Create an Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
      <View className="gap-6">
        {/* Profile Card */}
        <View className="items-center bg-surface rounded-xl p-4">
          <View className="justify-center items-center w-16 h-16 rounded-full mb-3" style={{ backgroundColor: colors.primaryLight }}>
            <User size={28} color={colors.primary} />
          </View>
          {editing ? (
            <View className="w-full gap-3">
              <TextInput
                value={name}
                onChangeText={setName}
                className="bg-surface border border-border rounded-lg p-3 text-[16px] text-foreground font-['Montserrat_400Regular'] min-h-[48px]"
                placeholder="Name"
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel="Edit name"
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                className="bg-surface border border-border rounded-lg p-3 text-[16px] text-foreground font-['Montserrat_400Regular'] min-h-[48px]"
                placeholder="Phone"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                accessibilityLabel="Edit phone"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setEditing(false)}
                  className="flex-1 items-center justify-center bg-surface border border-border rounded-lg p-3 min-h-[48px]"
                >
                  <Text className="font-semibold text-foreground font-['Montserrat_600SemiBold']">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  className="flex-1 items-center justify-center bg-primary rounded-lg p-3 min-h-[48px]"
                >
                  <Text className="text-primary-foreground font-bold font-['Montserrat_700Bold']">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="text-[18px] font-semibold leading-[24px] text-foreground font-['Montserrat_600SemiBold']">
                {user?.name}
              </Text>
              <Text className="text-[12px] leading-[16px] text-muted-foreground font-['Montserrat_500Medium'] mt-1">
                {user?.email}
              </Text>
              {user?.phone && (
                <Text className="text-[12px] leading-[16px] text-muted-foreground font-['Montserrat_500Medium']">
                  {user.phone}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => setEditing(true)}
                className="mt-3"
              >
                <Text className="text-primary font-semibold font-['Montserrat_600SemiBold']">Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Referral Card */}
        <View className="bg-surface rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Share2 size={20} color={colors.primary} />
            <Text className="font-bold text-[16px] text-foreground font-['Montserrat_700Bold']">
              Refer a Friend
            </Text>
          </View>
          <Text className="text-[12px] leading-[16px] text-muted-foreground font-['Montserrat_500Medium'] mb-3">
            Get 20 referrals to unlock a 30% discount coupon! You have {user?.referralCount ?? 0}/20 referrals.
          </Text>
          <View className="rounded-lg h-1 overflow-hidden mb-3" style={{ backgroundColor: colors.borderLight }}>
            <View style={{ backgroundColor: colors.warning, height: "100%", width: `${Math.min(100, ((user?.referralCount ?? 0) / 20) * 100)}%` }} />
          </View>
          {user?.couponActive && (
            <TouchableOpacity
              onPress={handleClaimCoupon}
              className="items-center justify-center bg-warning rounded-lg p-3 mb-3 min-h-[48px]"
              accessibilityLabel="Claim 30% coupon"
            >
              <View className="flex-row items-center gap-2">
                <Gift size={16} color={colors.warningForeground} />
                <Text className="text-warning-foreground font-bold font-['Montserrat_700Bold']">Claim 30% Coupon</Text>
              </View>
            </TouchableOpacity>
          )}
          <View className="flex-row items-center gap-2">
            <TextInput
              value={refCode}
              onChangeText={setRefCode}
              placeholder="Enter referral code"
              placeholderTextColor={colors.mutedForeground}
              className="flex-1 bg-surface border border-border rounded-lg p-3 text-[16px] text-foreground font-['Montserrat_400Regular'] min-h-[48px]"
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
              className="items-center justify-center bg-primary rounded-lg p-3 min-h-[48px] min-w-[80px]"
            >
              <Text className="text-primary-foreground font-bold font-['Montserrat_700Bold']">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center rounded-lg p-3 min-h-[48px]"
          style={{ backgroundColor: colors.destructiveLight }}
          accessibilityLabel="Logout"
          accessibilityRole="button"
        >
          <LogOut size={18} color={colors.destructive} />
          <Text className="text-destructive font-bold font-['Montserrat_700Bold'] ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
      )}
      </ScreenScrollView>
    </Screen>
  );
}
