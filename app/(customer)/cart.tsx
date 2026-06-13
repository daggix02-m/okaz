import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Screen, ScreenHeader, ScreenFlatList } from "@/components/ui/Screen";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight, CheckCircle, Package } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/stores/cart.store";
import { useCurrentUser } from "@/hooks/useAuth";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function CustomerCart() {
  const { colors } = useTheme();
  const { tabFooterBottom } = useScreenInsets();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    clear,
  } = useCartStore();
  const { user, isGuest } = useCurrentUser();
  const createOrder = useMutation(api.orders.create);
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "cbe" | "chapa">("chapa");
  const [address, setAddress] = useState("Bole Medhanealem, Addis Ababa");
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const couponActive = user?.couponActive ?? false;
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal(couponActive);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      // Group items by store
      const storeIds = [...new Set(items.map((i) => i.product.storeId))];
      for (const storeId of storeIds) {
        const storeItems = items.filter((i) => i.product.storeId === storeId);
        const storeSubtotal = storeItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        const storeDeliveryFee = Math.round(50 + 1.5 * 30);
        await createOrder({
          storeId: storeId as any,
          items: storeItems.map((i) => ({
            productId: i.product._id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal: storeSubtotal,
          deliveryFee: storeDeliveryFee,
          total: couponActive ? Math.round((storeSubtotal + storeDeliveryFee) * 0.7) : storeSubtotal + storeDeliveryFee,
          paymentMethod,
          deliveryAddress: address,
          deliveryLat: 9.03,
          deliveryLng: 38.74,
          couponApplied: couponActive,
        });
      }
      clear();
      setOrderComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <View className="justify-center items-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: colors.successLight }}>
          <CheckCircle size={36} color={colors.success} />
        </View>
        <Text className="text-center text-[22px] font-bold leading-[28px] text-foreground font-['Montserrat_700Bold']">
          Order Placed!
        </Text>
        <Text className="text-center text-[16px] leading-[24px] text-muted-foreground font-['Montserrat_400Regular'] mt-2">
          Track your order status in the Orders tab.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(customer)/orders")}
          className="justify-center items-center mt-6 bg-primary rounded-lg px-6 py-3 min-h-[48px]"
        >
          <Text className="text-primary-foreground font-bold font-['Montserrat_700Bold']">View Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title={step === "cart" ? "My Cart" : "Checkout"}
        subtitle={
          items.length > 0
            ? `${items.length} ${items.length === 1 ? "item" : "items"}`
            : undefined
        }
        right={<ThemeToggle />}
      />

      {step === "cart" ? (
        items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={48} color={colors.mutedForeground} />}
            title="Your cart is empty"
            message="Add products from the home screen."
            action={{ label: "Browse Products", onPress: () => router.push("/(customer)") }}
          />
        ) : (
          <>
            <ScreenFlatList
              data={items}
              keyExtractor={(item) => item.product._id}
              contentContainerStyle={{ padding: 16, paddingBottom: 16 }}
              withTabBar={false}
              renderItem={({ item }) => (
                <View className="flex-row p-3 bg-card rounded-xl border border-border mb-2 gap-3">
                  <View className="justify-center items-center w-14 h-14 bg-surface rounded-lg">
                    <Package size={28} color={colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="font-semibold text-[14px] text-foreground font-['Montserrat_600SemiBold']" numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text className="font-bold text-[14px] text-foreground font-['Montserrat_700Bold'] tabular-nums">
                      {item.product.price.toLocaleString()} ETB
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <TouchableOpacity
                        onPress={() => {
                          updateQuantity(item.product._id, item.quantity - 1);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className="justify-center items-center p-1 w-9 h-9 bg-surface rounded-lg"
                        accessibilityLabel="Decrease quantity"
                      >
                        <Minus size={14} color={colors.foreground} />
                      </TouchableOpacity>
                      <Text className="text-center font-semibold min-w-[20px] text-foreground font-['Montserrat_600SemiBold']">{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          updateQuantity(item.product._id, item.quantity + 1);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        className="justify-center items-center p-1 w-9 h-9 bg-surface rounded-lg"
                        accessibilityLabel="Increase quantity"
                      >
                        <Plus size={14} color={colors.foreground} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          removeItem(item.product._id);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        className="justify-center items-center p-1 w-9 h-9 ml-auto"
                        accessibilityLabel={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 size={16} color={colors.destructive} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
            <View
              className="border-t border-border bg-background p-4"
              style={{ paddingBottom: tabFooterBottom }}
            >
              <View className="flex-row justify-between mb-1">
                <Text className="text-muted-foreground font-['Montserrat_500Medium']">Subtotal</Text>
                <Text className="font-semibold text-foreground font-['Montserrat_600SemiBold'] tabular-nums">{subtotal.toLocaleString()} ETB</Text>
              </View>
              {couponActive && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-success font-['Montserrat_500Medium']">30% Coupon</Text>
                  <Text className="font-semibold text-success font-['Montserrat_600SemiBold'] tabular-nums">
                    -{Math.round(subtotal * 0.3).toLocaleString()} ETB
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between mb-3">
                <Text className="text-muted-foreground font-['Montserrat_500Medium']">Delivery</Text>
                <Text className="font-semibold text-foreground font-['Montserrat_600SemiBold'] tabular-nums">{deliveryFee.toLocaleString()} ETB</Text>
              </View>
              <View className="flex-row justify-between mb-4">
                <Text className="font-bold text-[16px] text-foreground font-['Montserrat_700Bold']">Total</Text>
                <Text className="font-bold text-[16px] text-foreground font-['Montserrat_700Bold'] tabular-nums">{total.toLocaleString()} ETB</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (isGuest) {
                    router.push("/(auth)/sign-in");
                    return;
                  }
                  setStep("checkout");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                className="items-center justify-center bg-primary rounded-lg p-3 min-h-[48px]"
                accessibilityLabel={isGuest ? "Sign in to checkout" : "Proceed to checkout"}
              >
                <Text className="text-primary-foreground font-bold text-[16px] font-['Montserrat_700Bold']">
                  {isGuest ? "Sign in to Checkout" : "Proceed to Checkout"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="gap-4">
            <View>
              <Text className="font-semibold mb-2 text-foreground font-['Montserrat_600SemiBold']">Delivery Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                className="bg-surface border border-border rounded-lg p-3 text-[16px] text-foreground font-['Montserrat_400Regular'] min-h-[48px]"
                accessibilityLabel="Delivery address"
              />
            </View>

            <View>
              <Text className="font-semibold mb-2 text-foreground font-['Montserrat_600SemiBold']">Payment Method</Text>
              {(["chapa", "telebirr", "cbe"] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  className="flex-row items-center p-3 rounded-lg border mb-2 min-h-[48px]"
                  style={{
                    backgroundColor: paymentMethod === method ? colors.primaryLight : colors.surface,
                    borderColor: paymentMethod === method ? colors.primary : colors.border,
                  }}
                  accessibilityRole="radio"
                  accessibilityLabel={method === "chapa" ? "Chapa" : method === "telebirr" ? "Telebirr" : "CBE"}
                  accessibilityState={{ selected: paymentMethod === method }}
                >
                  <View
                    className="w-5 h-5 rounded-full border-2 mr-3"
                    style={{
                      borderColor: paymentMethod === method ? colors.primary : colors.border,
                      backgroundColor: paymentMethod === method ? colors.primary : "transparent",
                    }}
                  />
                  <Text className="font-semibold capitalize text-foreground font-['Montserrat_600SemiBold']">{method}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between p-3 bg-surface rounded-lg">
              <Text className="font-bold text-foreground font-['Montserrat_700Bold']">Total</Text>
              <Text className="font-bold text-[18px] text-foreground font-['Montserrat_700Bold'] tabular-nums">{total.toLocaleString()} ETB</Text>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              disabled={loading}
              className="items-center justify-center bg-accent rounded-lg p-3 min-h-[48px]"
              style={{ opacity: loading ? 0.6 : 1 }}
              accessibilityLabel="Place order"
            >
              <Text className="text-accent-foreground font-bold text-[16px] font-['Montserrat_700Bold']">
                {loading ? "Placing Order..." : `Pay ${total.toLocaleString()} ETB`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStep("cart")}
              className="items-center p-2"
            >
              <Text className="text-primary font-semibold font-['Montserrat_600SemiBold']">Back to Cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
