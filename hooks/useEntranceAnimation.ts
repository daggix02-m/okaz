import { useRef, useEffect } from "react";
import { Animated, Easing, Platform } from "react-native";

export function useEntranceAnimation({
  delay = 0,
  duration = 400,
}: { delay?: number; duration?: number } = {}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const useNativeDriver = Platform.OS !== "web";

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, useNativeDriver]);

  return { opacity, translateY, scale };
}

export function useFadeAnimation({
  delay = 0,
  duration = 300,
}: { delay?: number; duration?: number } = {}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const useNativeDriver = Platform.OS !== "web";

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, useNativeDriver]);

  return { opacity };
}
