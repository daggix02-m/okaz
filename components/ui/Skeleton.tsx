import { View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { colors, radius } from "@/lib/design-tokens";

export function Skeleton({ height = 100, width: w }: { height?: number; width?: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, easing: Easing.ease, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={{
        height,
        width: w,
        backgroundColor: colors.light.border,
        borderRadius: radius.md,
        opacity,
      }}
    />
  );
}
