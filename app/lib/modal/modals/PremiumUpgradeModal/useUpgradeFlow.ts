import { useAuthStore } from "@/lib/auth/authStore";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { toastError } from "@/lib/toast";

interface UseUpgradeFlowProps {
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function useUpgradeFlow({ setIsLoading, onSuccess: _onSuccess, onCancel: _onCancel }: UseUpgradeFlowProps) {
  const user = useAuthStore((state: any) => state.user);

  const handleUpgrade = async () => {
    if (!user) {
      toastError("subscription.loginRequired");
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
      toastError("subscription.checkoutFailed");
      setIsLoading(false);
    }
  };

  return { handleUpgrade };
}
