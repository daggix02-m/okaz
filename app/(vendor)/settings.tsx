import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, Sliders } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMyStores } from "@/hooks/useStores";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";

export default function VendorSettings() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuthActions();
  const stores = useMyStores();
  const activeStore = stores?.[0];
  const paySubscription = useMutation(api.stores.paySubscription);
  const requestSponsorship = useMutation(api.stores.requestSponsorship);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          Settings
        </Text>
      </View>

      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        {/* Subscription */}
        {activeStore && (
          <View style={{ backgroundColor: colors.light.surface, borderRadius: radius.md, padding: spacing.lg }}>
            <Text style={{ fontWeight: "700", fontSize: 14, marginBottom: spacing.sm }}>Store Subscription</Text>
            <Text style={{ fontSize: 12, color: colors.light.textSecondary, marginBottom: spacing.md }}>
              Month {activeStore.subscriptionMonth} · {activeStore.subscriptionActive ? "Active" : "Suspended"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.light.textSecondary, marginBottom: spacing.md }}>
              Monthly fee: 100 ETB
            </Text>
            <TouchableOpacity
              onPress={() => {
                paySubscription({ storeId: activeStore._id });
                Alert.alert("Success", "Subscription paid!");
              }}
              style={{
                backgroundColor: colors.light.primary,
                borderRadius: radius.sm,
                padding: spacing.md,
                alignItems: "center",
                minHeight: 48,
                justifyContent: "center",
              }}
              accessibilityLabel="Pay subscription"
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Pay Monthly Fee (100 ETB)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                requestSponsorship({ storeId: activeStore._id });
                Alert.alert("Success", "Sponsorship activated!");
              }}
              style={{
                backgroundColor: "#F59E0B",
                borderRadius: radius.sm,
                padding: spacing.md,
                alignItems: "center",
                minHeight: 48,
                justifyContent: "center",
                marginTop: spacing.sm,
              }}
              accessibilityLabel="Request sponsorship"
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Request Sponsorship (150 ETB)</Text>
            </TouchableOpacity>
          </View>
        )}

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
        >
          <LogOut size={18} color={colors.light.destructive} />
          <Text style={{ color: colors.light.destructive, fontWeight: "700" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
