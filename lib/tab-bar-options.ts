import type { EdgeInsets } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "@/hooks/useScreenInsets";

type ThemeColors = {
  background: string;
  border: string;
  primary: string;
  mutedForeground: string;
};

export function getTabBarScreenOptions(colors: ThemeColors, insets: EdgeInsets) {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.mutedForeground,
    tabBarHideOnKeyboard: true,
    sceneContainerStyle: { backgroundColor: colors.background },
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      borderTopWidth: 0.5,
      height: TAB_BAR_HEIGHT + insets.bottom,
      paddingBottom: insets.bottom + 12,
      paddingTop: 10,
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: "600" as const,
      fontFamily: "Montserrat_600SemiBold",
      marginTop: 2,
    },
    tabBarItemStyle: {
      paddingVertical: 2,
    },
  };
}
