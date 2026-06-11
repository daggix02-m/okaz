import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  resolved: () => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
      toggle: () => {
        const resolved = get().resolved();
        set({ mode: resolved === "dark" ? "light" : "dark" });
      },
      resolved: () => {
        const { mode } = get();
        if (mode !== "system") return mode;
        const colorScheme = Appearance.getColorScheme();
        return colorScheme === "dark" ? "dark" : "light";
      },
    }),
    {
      name: "okaz-theme",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
