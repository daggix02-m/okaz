import { View, Text } from "react-native";
import { Check, Clock, Package, Bike, MapPin } from "lucide-react-native";
import { colors, spacing, statusColors } from "@/lib/design-tokens";
import { Doc } from "@/convex/_generated/dataModel";

type Order = Doc<"orders">;

const STEPS = ["pending", "confirmed", "packed", "assigned", "on_the_way", "delivered"] as const;
const STEP_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  assigned: "Assigned",
  on_the_way: "Transit",
  delivered: "Delivered",
};

export function OrderCard({ order }: { order: Order }) {
  const currentIdx = STEPS.indexOf(order.status);
  const statusColor = statusColors[order.status] || statusColors.pending;

  return (
    <View
      style={{
        backgroundColor: colors.light.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.light.textSecondary, fontVariant: ["tabular-nums"] }}>
          {order.orderId}
        </Text>
        <View
          style={{
            backgroundColor: statusColor.bg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: 9999,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: "700", color: statusColor.text, textTransform: "uppercase" }}>
            {STEP_LABELS[order.status]}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={{ gap: spacing.xs, marginBottom: spacing.md }}>
        {order.items.slice(0, 3).map((item, i) => (
          <View key={i} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: colors.light.text }} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.light.textSecondary }}>
              x{item.quantity}
            </Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <Text style={{ fontSize: 11, color: colors.light.textTertiary }}>
            +{order.items.length - 3} more items
          </Text>
        )}
      </View>

      {/* Total */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.light.border,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.light.text }}>
          {order.storeName ?? "Store"}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.light.text, fontVariant: ["tabular-nums"] }}>
          {order.total.toLocaleString()} ETB
        </Text>
      </View>

      {/* Progress */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md, paddingHorizontal: spacing.xs }}>
        {STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = step === order.status;
          return (
            <View key={step} style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: active ? 22 : 18,
                  height: active ? 22 : 18,
                  borderRadius: 11,
                  backgroundColor: done ? colors.light.accent : colors.light.surface,
                  borderWidth: done ? 0 : 1,
                  borderColor: colors.light.border,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {done ? (
                  <Check size={12} color="#FFFFFF" />
                ) : (
                  <Text style={{ fontSize: 9, color: colors.light.textTertiary }}>{idx + 1}</Text>
                )}
              </View>
              <Text
                style={{
                  fontSize: 8,
                  marginTop: 4,
                  color: active ? colors.light.primary : colors.light.textTertiary,
                  fontWeight: active ? "700" : "500",
                }}
              >
                {STEP_LABELS[step]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Rider info */}
      {order.riderId && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.light.surface,
            borderRadius: 8,
            marginTop: spacing.md,
          }}
        >
          <Bike size={16} color={colors.light.primary} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.light.text }}>
            Delivery agent assigned
          </Text>
        </View>
      )}
    </View>
  );
}
