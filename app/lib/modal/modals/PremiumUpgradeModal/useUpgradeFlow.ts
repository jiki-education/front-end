import { useAuthStore } from "@/lib/auth/authStore";
import { handlePurchasePremium } from "@/lib/subscriptions/handlers";
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
      // handlePurchasePremium shows the checkout modal, hiding this one first
      await handlePurchasePremium({ returnPath: window.location.pathname, backdrop: "dark" });
    } catch (error) {
      // handlePurchasePremium has already toasted the reason
      console.error("Purchase error:", error);
      setIsLoading(false);
    }
  };

  return { handleUpgrade };
}
