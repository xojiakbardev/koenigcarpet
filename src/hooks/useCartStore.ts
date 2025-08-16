import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  cart: number[];
  toggle: (id: number) => void;
  setCart: (id: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      toggle: (id) => {
        const wishlist = get().cart;
        if (wishlist) {
          if (wishlist.includes(id)) {
            set({ cart: wishlist.filter((id) => id !== id) });
          } else {
            set({ cart: [...wishlist, id] });
          }
        }
      },
      setCart: (id) => {
        const wishlist = get().cart;
        if (!wishlist.includes(id)) {
          set({ cart: [...wishlist, id] });
        }
      },
    }),
    { name: "cart" }
  )
);
