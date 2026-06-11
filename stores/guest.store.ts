import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GuestState {
  isGuest: boolean;
  setGuest: () => void;
  exitGuest: () => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      isGuest: false,
      setGuest: () => set({ isGuest: true }),
      exitGuest: () => set({ isGuest: false }),
    }),
    {
      name: "okaz-guest",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);