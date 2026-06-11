import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthButton({ label, onPress, loading, disabled }: AuthButtonProps) {
  const { colors } = useTheme();

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={loading || disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        activeOpacity={0.85}
        style={[
          { opacity: disabled ? 0.5 : 1, boxShadow: colors.shadow },
        ]}
        className="bg-primary rounded-xl min-h-[52px] justify-center items-center"
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} size="small" />
        ) : (
          <Text className="text-primary-foreground text-base font-bold font-[Montserrat_700Bold]">
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
