import type { ReactNode } from "react";
import { Platform, View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaProvider } from "react-native-safe-area-context";

const PHONE_WIDTH = 390;
const PHONE_MAX_HEIGHT = 844;
const FRAME_PADDING = 10;
const FRAME_RADIUS = 55;
const SCREEN_RADIUS = 44;
const STATUS_BAR_HEIGHT = 47;
const HOME_INDICATOR_HEIGHT = 28;
const ISLAND_WIDTH = 126;
const ISLAND_HEIGHT = 34;
const DESKTOP_BREAKPOINT = 768;

const BEZEL_COLOR = "#000000";
const FRAME_SHADOW =
  "0 0 0 1px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.15), 0 0 80px rgba(255,255,255,0.25), 0 20px 100px rgba(0,0,0,0.6)";

function StatusBarTime() {
  return (
    <Text className="font-bold text-[15px] text-foreground tracking-tight">
      9:41
    </Text>
  );
}

function SignalBars() {
  const { colors } = useTheme();
  const barHeights = [4, 6, 9, 12];

  return (
    <View className="flex-row items-end gap-[2px]">
      {barHeights.map((h, i) => (
        <View
          key={i}
          className="w-[3px] rounded-[1.2px]"
          style={{ height: h, backgroundColor: colors.foreground }}
        />
      ))}
    </View>
  );
}

function WifiIcon() {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-end">
      <View className="flex-row items-end gap-[1.5px]">
        {[4, 6, 8].map((h, i) => (
          <View
            key={i}
            className="w-[3px] rounded-[1.5px]"
            style={{ height: h, backgroundColor: colors.foreground }}
          />
        ))}
      </View>
    </View>
  );
}

function BatteryIcon() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center">
      <View
        className="h-[10.5px] w-[22px] justify-center overflow-hidden rounded-[2.5px] border-[1.2px]"
        style={{ borderColor: colors.foreground }}
      >
        <View
          className="mx-[1.5px] h-full rounded-[1px]"
          style={{ backgroundColor: colors.foreground }}
        />
      </View>
      <View
        className="ml-[1px] h-[3.5px] w-[1.5px] rounded-r-[0.5px]"
        style={{ backgroundColor: colors.foreground }}
      />
    </View>
  );
}

function DynamicIsland() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 11,
        left: "50%",
        marginLeft: -ISLAND_WIDTH / 2,
        width: ISLAND_WIDTH,
        height: ISLAND_HEIGHT,
        backgroundColor: "#000",
        borderRadius: ISLAND_HEIGHT / 2,
        overflow: "hidden",
        zIndex: 50,
        borderWidth: 0.5,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: ISLAND_HEIGHT / 2,
          right: ISLAND_HEIGHT / 2,
          height: 0.8,
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: 1,
        }}
      />
    </View>
  );
}

function HomeIndicator() {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center" style={{ height: HOME_INDICATOR_HEIGHT }}>
      <View
        className="rounded-full"
        style={{
          width: 134,
          height: 5,
          backgroundColor: colors.foreground,
          opacity: 0.28,
        }}
      />
    </View>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  const { theme, colors } = useTheme();
  const isDark = theme === "dark";
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const phoneHeight = Math.floor(Math.min(windowHeight - 60, PHONE_MAX_HEIGHT));

  return (
    <View
      style={{
        position: Platform.OS === "web" ? ("fixed" as any) : "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: windowWidth,
        height: windowHeight,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "#0b0b0d" : "#eff1f5",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: PHONE_WIDTH + FRAME_PADDING * 2,
          height: phoneHeight + FRAME_PADDING * 2,
          backgroundColor: BEZEL_COLOR,
          borderRadius: FRAME_RADIUS,
          padding: FRAME_PADDING,
          boxShadow: FRAME_SHADOW,
          position: "relative",
        }}
      >
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: PHONE_WIDTH, height: phoneHeight },
            insets: {
              top: STATUS_BAR_HEIGHT,
              bottom: HOME_INDICATOR_HEIGHT,
              left: 0,
              right: 0,
            },
          }}
        >
          <View
            style={{
              flex: 1,
              width: PHONE_WIDTH,
              height: phoneHeight,
              borderRadius: SCREEN_RADIUS,
              backgroundColor: colors.background,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <View style={{ ...StyleSheet.absoluteFill, zIndex: 1 }}>
              {children}
            </View>

            <View
              pointerEvents="none"
              className="flex-row items-end justify-between px-8"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: STATUS_BAR_HEIGHT,
                paddingBottom: 11,
                zIndex: 40,
              }}
            >
              <StatusBarTime />
              <View className="flex-row items-end gap-[6px] pb-[2.5px]">
                <SignalBars />
                <WifiIcon />
                <BatteryIcon />
              </View>
            </View>

            <DynamicIsland />

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: HOME_INDICATOR_HEIGHT,
                zIndex: 40,
              }}
            >
              <HomeIndicator />
            </View>
          </View>
        </SafeAreaProvider>
      </View>
    </View>
  );
}

export function WebMobileShell({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  // Real mobile browsers get a full-screen native-feeling layout.
  if (width < DESKTOP_BREAKPOINT) {
    return (
      <View style={{ flex: 1, width: "100%", height: "100%" }} className="bg-background">
        {children}
      </View>
    );
  }

  return <PhoneFrame>{children}</PhoneFrame>;
}
