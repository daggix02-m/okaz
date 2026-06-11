import { View, Text } from "react-native";
import { Check, Clock, Package, Bike, MapPin } from "lucide-react-native";
import { getStatusColor } from "@/lib/design-tokens";
import { useTheme } from "@/hooks/useTheme";
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
  const { colors } = useTheme();
  const currentIdx = STEPS.indexOf(order.status);
  const statusColor = getStatusColor(order.status, colors);

  return (
    <View className="bg-card rounded-xl border border-border p-4 mb-3">
      {/* Header */}
      <View className="flex-row justify-between mb-3">
        <Text className="text-[12px] font-semibold text-muted-foreground tabular-nums">
          {order.orderId}
        </Text>
        <View
          style={{ backgroundColor: statusColor.bg }}
          className="px-3 py-1 rounded-full"
        >
          <Text
            style={{ color: statusColor.text }}
            className="text-[10px] font-bold uppercase"
          >
            {STEP_LABELS[order.status]}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View className="gap-1 mb-3">
        {order.items.slice(0, 3).map((item, i) => (
          <View key={i} className="flex-row justify-between">
            <Text className="text-[13px] text-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-[12px] text-muted-foreground">
              x{item.quantity}
            </Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <Text className="text-[11px] text-muted-foreground">
            +{order.items.length - 3} more items
          </Text>
        )}
      </View>

      {/* Total */}
      <View className="flex-row justify-between pt-3 border-t border-border">
        <Text className="text-[13px] font-semibold text-foreground">
          Store
        </Text>
        <Text className="text-[14px] font-bold text-foreground tabular-nums">
          {order.total.toLocaleString()} ETB
        </Text>
      </View>

      {/* Progress */}
      <View className="flex-row justify-between mt-3 px-1">
        {STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = step === order.status;
          const stepColor = getStatusColor(step, colors);
          return (
            <View key={step} className="items-center flex-1">
              <View
                style={{
                  backgroundColor: done ? stepColor.bg : colors.surface,
                }}
                className={`w-5 h-5 rounded-full items-center justify-center ${done ? 'border-0' : 'border border-border'}`}
              >
                {done ? (
                  <Check size={12} color={stepColor.text} />
                ) : (
                  <Text className="text-[9px] text-muted-foreground">{idx + 1}</Text>
                )}
              </View>
              <Text
                style={{ color: active ? colors.primary : colors.mutedForeground }}
                className={`text-[8px] mt-1 ${active ? 'font-bold' : 'font-medium'}`}
              >
                {STEP_LABELS[step]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Rider info */}
      {order.riderId && (
        <View className="flex-row items-center gap-2 p-3 bg-surface rounded-lg mt-3">
          <Bike size={16} color={colors.primary} />
          <Text className="text-[12px] font-semibold text-foreground">
            Delivery agent assigned
          </Text>
        </View>
      )}
    </View>
  );
}
