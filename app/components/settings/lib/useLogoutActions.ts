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

    const result = await logoutFromStore();
    toast.dismiss();
    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } else {
      toast.error("Logout failed - couldn't reach server");
    }
    setIsLoggingOut(false);
  };

  return {
    isLoggingOut,
    handleLogoutFromThisDevice
  };
}
