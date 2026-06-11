import { View, Animated, Easing, Platform } from "react-native";
import { useEffect, useRef } from "react";
export function Skeleton({ height = 100, width: w }: { height?: number; width?: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: Platform.OS !== "web" }),
        Animated.timing(anim, { toValue: 0, duration: 800, easing: Easing.ease, useNativeDriver: Platform.OS !== "web" }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      className="rounded-xl bg-surface"
      style={{
        height,
        width: w,
        opacity,
      }}
    />
  );
}
