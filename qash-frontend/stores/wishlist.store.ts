import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: number[];
  addProduct: (id: number) => void;
  removeProduct: (id: number) => void;
  hasProduct: (id: number) => boolean;
  clearWishlist: () => void;
  setProductIds: (ids: number[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (id) =>
        set((state) => ({ productIds: [...state.productIds, id] })),
      removeProduct: (id) =>
        set((state) => ({
          productIds: state.productIds.filter((pid) => pid !== id),
        })),
      hasProduct: (id) => get().productIds.includes(id),
      clearWishlist: () => set({ productIds: [] }),
      setProductIds: (ids) => set({ productIds: ids }),
    }),
    { name: "qash-wishlist" }
  )
);
