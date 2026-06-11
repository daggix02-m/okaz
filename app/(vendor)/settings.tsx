import { View, Text, TouchableOpacity, Alert } from "react-native";
import { LogOut, Sliders } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMyStores } from "@/hooks/useStores";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import { Screen, ScreenHeader, ScreenScrollView } from "@/components/ui/Screen";

export default function VendorSettings() {
  const { colors } = useTheme();
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
    <Screen>
      <ScreenHeader title="Settings" />
      <ScreenScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="gap-6">
          {activeStore && (
            <View className="rounded-xl bg-surface p-4">
              <View className="mb-3 flex-row items-center gap-2">
                <Sliders size={20} color={colors.primary} />
                <Text className="font-['Montserrat_700Bold'] text-body font-bold text-foreground">
                  Subscription
                </Text>
              </View>
              <Text className="font-['Montserrat_500Medium'] text-caption text-muted-foreground">
                Month {activeStore.subscriptionMonth} ·{" "}
                {activeStore.subscriptionActive ? "Active" : "Suspended"}
              </Text>
              <Text className="mt-2 font-['Montserrat_500Medium'] text-caption text-muted-foreground">
                Monthly fee: 100 ETB
              </Text>
              <TouchableOpacity
                onPress={() => {
                  paySubscription({ storeId: activeStore._id });
                  Alert.alert("Success", "Subscription paid!");
                }}
                className="mt-3 min-h-[48px] items-center justify-center rounded-lg bg-primary p-3"
                accessibilityLabel="Pay subscription"
              >
                <Text className="font-['Montserrat_700Bold'] font-bold text-primary-foreground">
                  Pay Monthly Fee (100 ETB)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  requestSponsorship({ storeId: activeStore._id });
                  Alert.alert("Success", "Sponsorship activated!");
                }}
                className="mt-2 min-h-[48px] items-center justify-center rounded-lg bg-warning p-3"
                accessibilityLabel="Request sponsorship"
              >
                <Text className="font-['Montserrat_700Bold'] font-bold text-warning-foreground">
                  Request Sponsorship (150 ETB)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={handleLogout}
            className="min-h-[48px] flex-row items-center justify-center rounded-lg p-3"
            style={{ backgroundColor: colors.destructiveLight }}
            accessibilityLabel="Logout"
          >
            <LogOut size={18} color={colors.destructive} />
            <Text className="ml-2 font-['Montserrat_700Bold'] font-bold text-destructive">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenScrollView>
    </Screen>
  );
}
