import { View, Text, TouchableOpacity } from "react-native";
import { colors, typography, spacing } from "@/lib/design-tokens";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xxl,
      }}
      accessibilityLabel={title}
    >
      {icon && <View style={{ marginBottom: spacing.lg }}>{icon}</View>}
      <Text
        style={{
          fontSize: typography.h3.fontSize,
          fontWeight: typography.h3.fontWeight,
          color: colors.light.text,
          textAlign: "center",
          marginBottom: spacing.sm,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: typography.caption.fontSize,
          color: colors.light.textSecondary,
          textAlign: "center",
          marginBottom: action ? spacing.xl : 0,
        }}
      >
        {message}
      </Text>
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={{
            backgroundColor: colors.light.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: 8,
            minHeight: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
