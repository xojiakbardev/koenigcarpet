import { create } from "zustand";

type DrawerStore = {
  notif: boolean;
  cart: boolean;
  dashboardSidebar: boolean;
  filterbar: boolean;
  open: (type: keyof Omit<DrawerStore, "open" | "close">) => void;
  close: (type: keyof Omit<DrawerStore, "open" | "close">) => void;
};

const useDrawerStore = create<DrawerStore>((set) => ({
  notif: false,
  cart: false,
  dashboardSidebar: false,
  filterbar: false,
  open: (type) => set({ [type]: true }),
  close: (type) => set({ [type]: false }),
}));

export default useDrawerStore;
