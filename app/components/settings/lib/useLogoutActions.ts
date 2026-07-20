import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { toastError, toastLoading, toastSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function useLogoutActions() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: logoutFromStore } = useAuthStore();
  const router = useRouter();
  const routes = useLocaleRoutes();

  const handleLogoutFromThisDevice = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    toastLoading("logout.loading");

    const result = await logoutFromStore();
    toast.dismiss();
    if (result.success) {
      toastSuccess("logout.success");
      router.push(routes.authLogin());
    } else {
      toastError("logout.failed");
    }
    setIsLoggingOut(false);
  };

  return {
    isLoggingOut,
    handleLogoutFromThisDevice
  };
}
