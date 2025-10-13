"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserDTO } from "@/types/DTO/dtos";
import { useCartStore } from "./cartStore";

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: UserDTO | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  login: (accessToken: string, userData: UserDTO) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isInitialized: false,

      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      login: (accessToken, userData) => {
        set({
          accessToken,
          user: userData,
          isLoading: false,
        });
      },

      logout: async () => {
        set({ isLoading: true });

        set({
          accessToken: null,
          user: null,
          isLoading: false,
        });

        useCartStore.setState({
          dbCart: null,
          guestCart: [],
        });
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch {}
      },

      refreshAccessToken: async (): Promise<boolean> => {
        try {
          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include", // Important for refresh token cookie
          });

          if (response.ok) {
            const data = await response.json();
            set({
              accessToken: data.accessToken,
              user: data.user,
              isLoading: false,
            });
            return true;
          } else {
            // Refresh token invalid/expired
            set({
              accessToken: null,
              user: null,
              isLoading: false,
            });
            return false;
          }
        } catch {
          // Silently handle refresh errors
          set({
            accessToken: null,
            user: null,
            isLoading: false,
          });
          return false;
        }
      },

      initializeAuth: async () => {
        const { isInitialized } = get();
        if (isInitialized) return;

        set({ isLoading: true });
        try {
          const success = await get().refreshAccessToken();
          if (!success) {
            set({
              user: null,
              accessToken: null,
            });
          }
        } catch {
          set({
            user: null,
            accessToken: null,
          });
        } finally {
          set({
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
