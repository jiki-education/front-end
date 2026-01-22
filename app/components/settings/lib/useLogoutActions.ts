import { useAuthStore } from "@/lib/auth/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  return {
    isLoggingOut,
    handleLogoutFromThisDevice
  };
}
