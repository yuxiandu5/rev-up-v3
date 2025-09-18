import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export const useApiClient = () => {
  const router = useRouter();
  const { accessToken, refreshAccessToken, logout } = useAuthStore();

  const apiCall = async (url: string, options: RequestInit = {}) => {
    // Add authorization header if we have a token
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // For refresh token cookie
      });

      // If unauthorized, try to refresh token
      if (response.status === 401 && accessToken) {
        await refreshAccessToken();
        const { accessToken: newAccessToken } = useAuthStore.getState();
        
        if (newAccessToken) {
          // Retry the original request with new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          
          return fetch(url, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
          });
        } else {
          // Refresh failed, logout user
          await logout();
          router.push("/");
          throw new Error("Session expired. Please login again.");
        }
      }

      return response;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  return { apiCall };
};
