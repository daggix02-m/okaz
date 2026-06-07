import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight } from "lucide-react-native";
import { colors, typography, spacing, radius } from "@/lib/design-tokens";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/stores/cart.store";
import { useCurrentUser } from "@/hooks/useAuth";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

export default function CustomerCart() {
  const insets = useSafeAreaInsets();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    clear,
  } = useCartStore();
  const { user } = useCurrentUser();
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
        await createOrder({
          storeId: storeId as any,
          items: storeItems.map((i) => ({
            productId: i.product._id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal: storeSubtotal,
          deliveryFee: Math.round(50 + 1.5 * 30),
          total: couponActive ? Math.round((storeSubtotal + Math.round(50 + 1.5 * 30)) * 0.7) : storeSubtotal + Math.round(50 + 1.5 * 30),
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
      <View style={{ flex: 1, backgroundColor: colors.light.background, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <View style={{ backgroundColor: colors.light.accentLight, width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: spacing.xl }}>
          <Text style={{ fontSize: 36 }}>✓</Text>
        </View>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text, textAlign: "center" }}>
          Order Placed!
        </Text>
        <Text style={{ fontSize: typography.body.fontSize, color: colors.light.textSecondary, textAlign: "center", marginTop: spacing.sm }}>
          Track your order status in the Orders tab.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(customer)/orders")}
          style={{
            marginTop: spacing.xl,
            backgroundColor: colors.light.primary,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            minHeight: 48,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>View Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.light.background }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.light.border }}>
        <Text style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, color: colors.light.text }}>
          {step === "cart" ? "My Cart" : "Checkout"}
        </Text>
        {items.length > 0 && (
          <Text style={{ fontSize: typography.caption.fontSize, color: colors.light.textSecondary, marginTop: spacing.xs }}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </Text>
        )}
      </View>

      {step === "cart" ? (
        items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={48} color={colors.light.textTertiary} />}
            title="Your cart is empty"
            message="Add products from the home screen."
            action={{ label: "Browse Products", onPress: () => router.push("/(customer)") }}
          />
        ) : (
          <>
            <FlatList
              data={items}
              keyExtractor={(item) => item.product._id}
              contentContainerStyle={{ padding: spacing.lg }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    padding: spacing.md,
                    backgroundColor: colors.light.background,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.light.border,
                    marginBottom: spacing.sm,
                    gap: spacing.md,
                  }}
                >
                  <View style={{ width: 56, height: 56, backgroundColor: colors.light.surface, borderRadius: radius.sm, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 24 }}>📦</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "600", fontSize: 14, color: colors.light.text }} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.light.text, fontVariant: ["tabular-nums"] }}>
                      {item.product.price.toLocaleString()} ETB
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs }}>
                      <TouchableOpacity
                        onPress={() => {
                          updateQuantity(item.product._id, item.quantity - 1);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={{ padding: spacing.xs, minWidth: 36, minHeight: 36, justifyContent: "center", alignItems: "center", backgroundColor: colors.light.surface, borderRadius: radius.sm }}
                        accessibilityLabel="Decrease quantity"
                      >
                        <Minus size={14} color={colors.light.text} />
                      </TouchableOpacity>
                      <Text style={{ fontWeight: "600", minWidth: 20, textAlign: "center" }}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          updateQuantity(item.product._id, item.quantity + 1);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={{ padding: spacing.xs, minWidth: 36, minHeight: 36, justifyContent: "center", alignItems: "center", backgroundColor: colors.light.surface, borderRadius: radius.sm }}
                        accessibilityLabel="Increase quantity"
                      >
                        <Plus size={14} color={colors.light.text} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          removeItem(item.product._id);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        style={{ padding: spacing.xs, minWidth: 36, minHeight: 36, justifyContent: "center", alignItems: "center", marginLeft: "auto" }}
                        accessibilityLabel={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 size={16} color={colors.light.destructive} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
            <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.light.border, backgroundColor: colors.light.background }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
                <Text style={{ color: colors.light.textSecondary }}>Subtotal</Text>
                <Text style={{ fontWeight: "600", fontVariant: ["tabular-nums"] }}>{subtotal.toLocaleString()} ETB</Text>
              </View>
              {couponActive && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
                  <Text style={{ color: "#D97706" }}>30% Coupon</Text>
                  <Text style={{ fontWeight: "600", color: "#D97706", fontVariant: ["tabular-nums"] }}>
                    -{Math.round(subtotal * 0.3).toLocaleString()} ETB
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md }}>
                <Text style={{ color: colors.light.textSecondary }}>Delivery</Text>
                <Text style={{ fontWeight: "600", fontVariant: ["tabular-nums"] }}>{deliveryFee.toLocaleString()} ETB</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.lg }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Total</Text>
                <Text style={{ fontWeight: "700", fontSize: 16, fontVariant: ["tabular-nums"] }}>{total.toLocaleString()} ETB</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setStep("checkout");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                style={{
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.sm,
                  padding: spacing.md,
                  minHeight: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                accessibilityLabel="Proceed to checkout"
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <View style={{ gap: spacing.lg }}>
            <View>
              <Text style={{ fontWeight: "600", marginBottom: spacing.sm, color: colors.light.text }}>Delivery Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
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
                accessibilityLabel="Delivery address"
              />
            </View>

            <View>
              <Text style={{ fontWeight: "600", marginBottom: spacing.sm, color: colors.light.text }}>Payment Method</Text>
              {(["chapa", "telebirr", "cbe"] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing.md,
                    backgroundColor: paymentMethod === method ? colors.light.primaryLight : colors.light.surface,
                    borderRadius: radius.sm,
                    borderWidth: 1,
                    borderColor: paymentMethod === method ? colors.light.primary : colors.light.border,
                    marginBottom: spacing.sm,
                    minHeight: 48,
                  }}
                  accessibilityRole="radio"
                  accessibilityLabel={method === "chapa" ? "Chapa" : method === "telebirr" ? "Telebirr" : "CBE"}
                  accessibilityState={{ selected: paymentMethod === method }}
                >
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: paymentMethod === method ? colors.light.primary : colors.light.border,
                    backgroundColor: paymentMethod === method ? colors.light.primary : "transparent",
                    marginRight: spacing.md,
                  }} />
                  <Text style={{ fontWeight: "600", textTransform: "capitalize" }}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: spacing.md, backgroundColor: colors.light.surface, borderRadius: radius.sm }}>
              <Text style={{ fontWeight: "700" }}>Total</Text>
              <Text style={{ fontWeight: "700", fontSize: 18, fontVariant: ["tabular-nums"] }}>{total.toLocaleString()} ETB</Text>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              disabled={loading}
              style={{
                backgroundColor: colors.light.accent,
                borderRadius: radius.sm,
                padding: spacing.md,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
              }}
              accessibilityLabel="Place order"
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>
                {loading ? "Placing Order..." : `Pay ${total.toLocaleString()} ETB`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStep("cart")}
              style={{ alignItems: "center", padding: spacing.sm }}
            >
              <Text style={{ color: colors.light.primary, fontWeight: "600" }}>Back to Cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
