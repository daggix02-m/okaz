import { TouchableOpacity } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useThemeStore } from "@/stores/theme.store";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";

export function ThemeToggle({ size = 20 }: { size?: number }) {
  const resolved = useThemeStore((s) => s.resolved);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = resolved() === "dark";
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggle();
      }}
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-10 w-10 items-center justify-center"
    >
      {isDark ? <Sun size={size} color={colors.warning} /> : <Moon size={size} color={colors.primary} />}
    </TouchableOpacity>
  );
}
