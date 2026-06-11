import type { ReactNode } from "react";
import { Platform, View, Text, useWindowDimensions } from "react-native";
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

const BEZEL_COLOR = "#1d1d1f";
const FRAME_SHADOW =
  "0 0 0 0.5px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.18)";

function StatusBarTime() {
  return (
    <Text className="font-semibold text-[14px] text-foreground tracking-tight">
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
        top: 10,
        left: "50%",
        marginLeft: -ISLAND_WIDTH / 2,
        width: ISLAND_WIDTH,
        height: ISLAND_HEIGHT,
        backgroundColor: "#000",
        borderRadius: ISLAND_HEIGHT / 2,
        overflow: "hidden",
        zIndex: 50,
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
  const { colors } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const phoneHeight = Math.floor(Math.min(windowHeight * 0.86, PHONE_MAX_HEIGHT));

  return (
    <View
      className="h-full w-full flex-1 items-center justify-center"
      style={{
        backgroundColor: "transparent",
        padding: Math.max(24, (windowWidth - PHONE_WIDTH - FRAME_PADDING * 2) / 3),
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
            className="relative flex-1 overflow-hidden"
            style={{
              borderRadius: SCREEN_RADIUS,
              backgroundColor: colors.background,
            }}
          >
            <View className="absolute inset-0">{children}</View>

            <View
              pointerEvents="none"
              className="flex-row items-end justify-between px-7"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: STATUS_BAR_HEIGHT,
                paddingBottom: 8,
                zIndex: 40,
              }}
            >
              <StatusBarTime />
              <View className="flex-row items-end gap-[6px] pb-[2px]">
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
    return <View className="h-full w-full flex-1 bg-background">{children}</View>;
  }

  return <PhoneFrame>{children}</PhoneFrame>;
}
