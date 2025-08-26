"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when the app starts
    initializeAuth();
  }, [initializeAuth]);

  // Show loading spinner while initializing
  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
