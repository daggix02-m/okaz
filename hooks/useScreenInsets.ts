import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_HEIGHT = 56;
const HEADER_PADDING = 12;

/** Minimum top inset when the platform reports none (common on mobile web). */
const WEB_MIN_TOP_INSET = Platform.OS === "web" ? 12 : 0;

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top, WEB_MIN_TOP_INSET);

  return {
    top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    headerTop: top + HEADER_PADDING,
    /** Bottom padding for scrollable tab content above the tab bar. */
    tabContentBottom: TAB_BAR_HEIGHT + insets.bottom + 16,
    /** Bottom padding for fixed footers inside tab screens. */
    tabFooterBottom: insets.bottom + 16,
  } as const;
}
