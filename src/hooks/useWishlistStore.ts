import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  wishlist: number[];
  toggle: (car_id: number) => void;
  setWishlist: (car_id: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggle: (car_id) => {
        const wishlist = get().wishlist;
        if (wishlist) {
          if (wishlist.includes(car_id)) {
            set({ wishlist: wishlist.filter((id) => id !== car_id) });
          } else {
            set({ wishlist: [...wishlist, car_id] });
          }
        }
      },
      setWishlist: (car_id) => {
        const wishlist = get().wishlist;
        if (!wishlist.includes(car_id)) {
          set({ wishlist: [...wishlist, car_id] });
        }
      },
    }),
    { name: "wishlist" }
  )
);
