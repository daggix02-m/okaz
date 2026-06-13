import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Platform } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Eye, EyeOff } from "lucide-react-native";

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  textContentType?: "none" | "emailAddress" | "password" | "name" | "newPassword";
  autoComplete?: "email" | "password" | "name" | "new-password" | "off";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  accessibilityLabel?: string;
}

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  textContentType = "none",
  autoComplete = "off",
  autoCapitalize = "none",
  error,
  accessibilityLabel,
}: AuthInputProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isActive = focused || value.length > 0;

  const triggerShake = () => {
    const useNativeDriver = Platform.OS !== "web";
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver }),
      Animated.timing(shakeAnim, { toValue: -3, duration: 50, useNativeDriver }),
      Animated.timing(shakeAnim, { toValue: 3, duration: 50, useNativeDriver }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver }),
    ]).start();
  };

  const containerBgColor = isDark ? "#242432" : colors.card;
  const borderColor = error
    ? colors.destructive
    : focused
      ? colors.primary
      : isDark
        ? "rgba(255,255,255,0.1)"
        : colors.borderLight;

  const labelColor = error
    ? colors.destructive
    : focused
      ? colors.primary
      : isDark
        ? "rgba(255,255,255,0.5)"
        : colors.textSecondary;

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      <View
        style={{
          backgroundColor: containerBgColor,
          borderColor,
          borderWidth: 1,
          paddingTop: isActive ? 16 : 12,
          paddingBottom: isActive ? 8 : 12,
        }}
        className="rounded-xl px-4 min-h-[58px] justify-center"
      >
        {isActive && (
          <Text
            style={{
              position: "absolute",
              top: 10,
              left: 16,
              fontSize: 10,
              fontWeight: "600",
              color: labelColor,
              fontFamily: "Montserrat_600SemiBold",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {label}
          </Text>
        )}
        <View className="flex-row items-center">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={isActive ? placeholder ?? "" : label}
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            textContentType={textContentType as any}
            autoComplete={autoComplete as any}
            autoCapitalize={autoCapitalize}
            accessibilityLabel={accessibilityLabel ?? label}
            onFocus={() => { setFocused(true); }}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1,
              fontSize: 16,
              color: colors.foreground,
              fontFamily: "Montserrat_400Regular",
              padding: 0,
            }}
          />
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="justify-center items-center min-w-[44px] min-h-[44px]"
              style={{ padding: 4 }}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} color={colors.mutedForeground} />
              ) : (
                <Eye size={18} color={colors.mutedForeground} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {error ? (
        <Text
          className="text-destructive text-[11px] font-medium mt-1 ml-1"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}
    </Animated.View>
  );
}
