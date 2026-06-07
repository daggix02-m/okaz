import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Doc } from "@/convex/_generated/dataModel";

export interface CartItem {
  product: Doc<"products">;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Doc<"products">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: (couponActive: boolean) => number;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (product.stock <= 0) return;
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id
                  ? { ...i, quantity: Math.min(product.stock, i.quantity + 1) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product._id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product._id === productId
              ? { ...i, quantity: Math.min(i.product.stock, quantity) }
              : i,
          ),
        }));
      },

      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      getDeliveryFee: () => {
        return 150; // Base ETB 150
      },

      getTotal: (couponActive) => {
        const subtotal = get().getSubtotal();
        const delivery = get().getDeliveryFee();
        const total = subtotal + delivery;
        return couponActive ? Math.round(total * 0.7) : total;
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "okaz-cart",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
