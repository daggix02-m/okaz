import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center p-8"
      accessibilityLabel={title}
    >
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-lg font-semibold text-foreground text-center mb-2 font-['Montserrat_600SemiBold']">
        {title}
      </Text>
      <Text className={`text-xs text-muted-foreground text-center font-['Montserrat_500Medium'] ${action ? 'mb-6' : ''}`}>
        {message}
      </Text>
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="bg-primary px-6 py-3 rounded-lg min-h-[48px] justify-center items-center"
        >
          <Text className="text-primary-foreground font-bold text-sm font-['Montserrat_700Bold']">{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
