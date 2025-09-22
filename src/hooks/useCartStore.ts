import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RugProduct } from "../types/product";

interface CartItem {
  item: RugProduct;
  quantity: number;
  totalPrice: number;
  size: string; 
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: RugProduct, quantity: number, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity, size) => {
        const cart = get().cart;
        const existing = cart.find(
          (c) => c.item.id === product.id && c.size === size
        );
        const price = product.price;

        if (existing) {
          set({
            cart: cart.map((c) =>
              c.item.id === product.id && c.size === size
                ? { ...c, quantity, totalPrice: quantity * price }
                : c
            ),
          });
        } else {
          const newItem: CartItem = {
            item: product,
            quantity,
            totalPrice: quantity * price,
            size,
          };
          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (id, size) => {
        set({
          cart: get().cart.filter((c) => !(c.item.id === id && c.size === size)),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      totalItems: () => {
        return get().cart.reduce((acc, c) => acc + c.quantity, 0);
      },

      totalPrice: () => {
        return get().cart.reduce((acc, c) => acc + c.totalPrice, 0);
      },
    }),
    { name: "cart" }
  )
);
