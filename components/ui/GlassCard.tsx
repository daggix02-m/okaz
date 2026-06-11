import React from "react";
import { Pressable, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { MotiView } from "moti";

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, onPress, style }) => {
  const { colors } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            backgroundColor: colors.glassBackground,
            borderColor: colors.borderLight,
            boxShadow: colors.shadow,
          },
          pressed && { opacity: 0.9 },
          style,
        ]}
        className="rounded-xl border overflow-hidden p-3"
      >
        {children}
      </Pressable>
    </MotiView>
  );
};
