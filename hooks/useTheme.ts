import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useThemeStore } from "@/stores/theme.store";
import { colors as colorPalettes } from "@/lib/design-tokens";

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme();
  const resolved = useThemeStore((s) => s.resolved);
  const toggle = useThemeStore((s) => s.toggle);
  const setMode = useThemeStore((s) => s.setMode);

  const theme = useMemo<"light" | "dark">(() => {
    if (mode !== "system") return mode;
    return systemScheme === "dark" ? "dark" : "light";
  }, [mode, systemScheme]);

  const colors = useMemo(() => colorPalettes[theme], [theme]);

  return { theme, mode, colors, toggle, setMode, resolved } as const;
}
