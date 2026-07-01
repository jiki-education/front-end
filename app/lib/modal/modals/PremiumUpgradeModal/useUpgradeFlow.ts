import { useAuthStore } from "@/lib/auth/authStore";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface UseUpgradeFlowProps {
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function useUpgradeFlow({ setIsLoading, onSuccess: _onSuccess, onCancel: _onCancel }: UseUpgradeFlowProps) {
  const t = useTranslations("toasts.subscription");
  const user = useAuthStore((state: any) => state.user);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error(t("loginRequired"));
      return;
    }

    setIsLoading(true);
    try {
      // handleSubscribe will show the checkout modal
      // It calls hideModal internally before showing the new modal
      await handleSubscribe({
        interval: "monthly",
        userEmail: user.email,
        returnPath: window.location.pathname
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(t("checkoutFailed"));
      setIsLoading(false);
    }
  };

  return { handleUpgrade };
}
