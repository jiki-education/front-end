import { useAuthStore } from "@/lib/auth/authStore";
import { getApiUrl } from "@/lib/api/config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function useLogoutActions() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: logoutFromStore, setNoUser } = useAuthStore();
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
      // Call Rails logout/all endpoint directly
      await fetch(getApiUrl("/auth/logout/all"), {
        method: "DELETE",
        credentials: "include"
      });
      setNoUser(null);

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
