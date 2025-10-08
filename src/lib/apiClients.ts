import { useAuthStore } from "@/stores/authStore";

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const { accessToken, refreshAccessToken, logout } = useAuthStore.getState();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401 && accessToken) {
      await refreshAccessToken();
      const { accessToken: newAccessToken } = useAuthStore.getState();

      if (newAccessToken) {
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
        await logout();
        throw new Error("Session expired. Please login again.");
      }
    }

    return response;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};
