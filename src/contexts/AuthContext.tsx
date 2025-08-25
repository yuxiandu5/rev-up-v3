"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - try to refresh token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const success = await refreshAccessToken();
      setIsLoading(false);
      
      if (!success) {
        setUser(null);
        setAccessToken(null);
      }
    };

    initializeAuth();
  }, []);

  const login = (newAccessToken: string, userData: User) => {
    setAccessToken(newAccessToken);
    setUser(userData);
  };

  const logout = async () => {
    // Clear memory
    setAccessToken(null);
    setUser(null);
    router.push("/");
    
    // Call logout API to clear refresh token cookie
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Important for refresh token cookie
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
        return true;
      } else {
        // Refresh token invalid/expired
        setAccessToken(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      setAccessToken(null);
      setUser(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("context", context);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
