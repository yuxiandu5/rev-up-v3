import { useAuth } from "@/contexts/AuthContext";

export const useApiClient = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

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
        const refreshSuccess = await refreshAccessToken();
        
        if (refreshSuccess) {
          // Retry the original request with new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
          };
          
          return fetch(url, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
          });
        } else {
          // Refresh failed, logout user
          logout();
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
