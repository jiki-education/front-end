import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logoutFromAllDevices as logoutFromAllDevicesService } from "@/lib/auth/service";
import toast from "react-hot-toast";

export function useLogoutActions() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: logoutFromStore } = useAuthStore();
  const router = useRouter();

  const handleLogoutFromThisDevice = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    toast.loading("Logging out...");

    try {
      await logoutFromStore();
      toast.dismiss();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to log out. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutFromAllDevices = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    toast.loading("Logging out from all devices...");

    try {
      // Call the all devices logout endpoint - this invalidates ALL tokens including ours
      await logoutFromAllDevicesService();

      // Manually clear local state without making another API call
      // since our token is already invalidated by the previous call
      const { removeAccessToken } = await import("@/lib/auth/storage");
      removeAccessToken();

      // Clear the auth store state directly (without API call)
      const { useAuthStore } = await import("@/stores/authStore");
      const store = useAuthStore.getState();
      store.setLoading(false);
      // Manually set the auth state to logged out
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      toast.dismiss();
      toast.success("Logged out from all devices successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to log out from all devices. Please try again.");
      console.error("Logout from all devices error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    isLoggingOut,
    handleLogoutFromThisDevice,
    handleLogoutFromAllDevices
  };
}
