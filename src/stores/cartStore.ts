"use client";

import { CartItemDTO, CartResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiCall } from "@/lib/apiClients";
import { toast } from "sonner";
import { useAuthStore } from "./authStore";

interface CartState {
  guestCart: CartItemDTO[];
  dbCart: CartResponseDTO | null;
  isLoading: boolean;
  isSyncing: boolean;

  getActiveCart: () => CartItemDTO[];
  getSubtotalCents: () => number;
  getItemCount: () => number;
  addItem: (product: CartItemDTO) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncGuestCart: () => Promise<void>;
  fetchCart: () => Promise<void>;

  _revertOptimisticUpdate: () => void;
  _showError: (message: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestCart: [],
      dbCart: null,

      isLoading: false,
      isSyncing: false,

      getActiveCart: () => {
        const { dbCart, guestCart } = get();
        return dbCart ? dbCart.items : guestCart;
      },

      getSubtotalCents: () => {
        const { dbCart, guestCart } = get();
        return dbCart
          ? dbCart.subtotalCents
          : guestCart.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0);
      },

      getItemCount: () => {
        const activeCart = get().getActiveCart();
        return activeCart.reduce((sum, item) => (sum += item.quantity), 0);
      },

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const res = await apiCall("/api/cart");
          if (!res.ok) throw new Error("Failed to fetch cart");
          const { data } = await res.json();
          set({ dbCart: data });
        } catch (e) {
          if (e instanceof Error) {
            get()._showError(e.message);
          } else {
            get()._showError("Unexpected error");
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (cartItem) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          const existingItem = get().guestCart.find(
            (item) => item.productId === cartItem.productId
          );
          if (existingItem) {
            set({
              guestCart: get().guestCart.map((item) =>
                item.productId === cartItem.productId
                  ? { ...item, quantity: item.quantity + cartItem.quantity }
                  : item
              ),
            });
          } else {
            set({ guestCart: [...get().guestCart, cartItem] });
          }
          return;
        }

        const originalCart = get().dbCart;
        set({ isLoading: true });
        if (originalCart) {
          set({
            dbCart: { ...originalCart, items: [...originalCart.items, cartItem] },
          });
        }
        try {
          const res = await apiCall("/api/cart/items", {
            method: "POST",
            body: JSON.stringify({
              productId: cartItem.productId,
              quantity: cartItem.quantity,
            }),
          });
          if (!res.ok) throw new Error("Failed to add item");

          await get().fetchCart();
        } catch (e) {
          set({ dbCart: originalCart });
          if (e instanceof Error) {
            get()._showError(e.message);
          } else {
            get()._showError("Unexpected error");
          }
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({
            guestCart: get().guestCart.map((item) =>
              item.id === cartItemId ? { ...item, quantity: quantity } : item
            ),
          });
          return;
        }

        const originalCart = get().dbCart;
        set({ isLoading: true });
        if (originalCart) {
          set({
            dbCart: {
              ...originalCart,
              items: originalCart.items.map((item) =>
                item.id === cartItemId ? { ...item, quantity: quantity } : item
              ),
            },
          });
        }
        try {
          const res = await apiCall("/api/cart/items", {
            method: "PATCH",
            body: JSON.stringify({
              cartItemId: cartItemId,
              quantity: quantity,
            }),
          });
          if (!res.ok) throw new Error("Failed to update item quantity");

          await get().fetchCart();
        } catch (e) {
          set({ dbCart: originalCart });
          if (e instanceof Error) {
            get()._showError(e.message);
          } else {
            get()._showError("Unexpected error");
          }
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (cartItemId) => {
        const { user } = useAuthStore.getState();

        if (!user) {
          set({
            guestCart: get().guestCart.filter((item) => item.id !== cartItemId),
          });
          return;
        }

        const originalCart = get().dbCart;
        set({ isLoading: true });
        if (originalCart) {
          set({
            dbCart: {
              ...originalCart,
              items: originalCart.items.filter((item) => item.id !== cartItemId),
            },
          });
        }
        try {
          const res = await apiCall("/api/cart/items", {
            method: "DELETE",
            body: JSON.stringify({
              cartItemId: cartItemId,
            }),
          });
          if (!res.ok) throw new Error("Failed to remove item");

          await get().fetchCart();
        } catch (e) {
          set({ dbCart: originalCart });
          if (e instanceof Error) {
            get()._showError(e.message);
          } else {
            get()._showError("Unexpected error");
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState();

        if (!user) {
          set({ guestCart: [] });
          return;
        }

        const originalCart = get().dbCart;
        set({ dbCart: null });
        set({ isLoading: true });
        try {
          const res = await apiCall("/api/cart", {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to clear cart");
          await get().fetchCart();
        } catch (e) {
          set({ dbCart: originalCart });
          if (e instanceof Error) {
            get()._showError(e.message);
          } else {
            get()._showError("Unexpected error");
          }
        } finally {
          set({ isLoading: false });
        }
      },

      syncGuestCart: async () => {
        set({ isLoading: true });
        const { guestCart } = get();
        const formattedGuestCart = guestCart.map((item) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
          };
        });
        try {
          const res = await apiCall("/api/cart/sync", {
            method: "POST",
            body: JSON.stringify({
              guestCartItems: formattedGuestCart,
            }),
          });
          if (!res.ok) throw new Error("Failed to sync cart");
          get().fetchCart();
          set({ guestCart: [] });
        } catch (e) {
          if (e instanceof Error) {
            get()._showError(e.message);
          } else {
            get()._showError("Unexpected error");
          }
        } finally {
          set({ isLoading: false });
        }
      },

      _revertOptimisticUpdate: () => {
        get().fetchCart();
      },

      _showError: (message) => {
        toast.error(message);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        guestCart: state.guestCart,
      }),
    }
  )
);
