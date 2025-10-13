"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized, isLoading, user } = useAuthStore();

  const guestCart = useCartStore((state) => state.guestCart);
  const syncGuestCart = useCartStore((state) => state.syncGuestCart);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user && guestCart.length > 0 && isInitialized) {
      syncGuestCart();
    }
  }, [user, guestCart.length]);

  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
