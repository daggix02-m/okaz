import { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";

const BLOBS = [
  { size: 180, x: -40, y: -60, color: "primary", delay: 0, duration: 12000 },
  { size: 140, x: 60, y: 30, color: "accent", delay: 2000, duration: 15000 },
  { size: 120, x: -20, y: 70, color: "chart1", delay: 4000, duration: 10000 },
] as const;

export function AnimatedBackground() {
  const { colors } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill} className="overflow-hidden pointer-events-none">
      <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />
      {BLOBS.map((blob, i) => (
        <Blob key={i} {...blob} />
      ))}
    </View>
  );
}

function Blob({
  size,
  x,
  y,
  color,
  delay,
  duration,
}: {
  size: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
}) {
  const { colors } = useTheme();
  const blobColor =
    color === "primary"
      ? colors.primary
      : color === "accent"
        ? colors.accent
        : color === "chart1"
          ? colors.chart1
          : colors.primary;
  const alpha = "10";

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const tx = withRepeat(
      withTiming(30, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    const ty = withRepeat(
      withTiming(-20, { duration: duration * 0.8, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    const sc = withRepeat(
      withTiming(1.15, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    const rt = withRepeat(
      withTiming(15, { duration: duration * 1.5, easing: Easing.linear }),
      -1,
      true
    );

    translateX.value = withDelay(delay, tx);
    translateY.value = withDelay(delay, ty);
    scale.value = withDelay(delay, sc);
    rotate.value = withDelay(delay, rt);

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(scale);
      cancelAnimation(rotate);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: blobColor + alpha,
          opacity: 0.6,
        },
        animatedStyle,
      ]}
    />
  );
}
