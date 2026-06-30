import { useAuthStore } from "@/lib/auth/authStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function useLogoutActions() {
  const t = useTranslations("toasts.logout");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: logoutFromStore } = useAuthStore();
  const router = useRouter();

  const handleLogoutFromThisDevice = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    toast.loading(t("loading"));

    const result = await logoutFromStore();
    toast.dismiss();
    if (result.success) {
      toast.success(t("success"));
      router.push("/auth/login");
    } else {
      toast.error(t("failed"));
    }
    setIsLoggingOut(false);
  };

  return {
    isLoggingOut,
    handleLogoutFromThisDevice
  };
}
