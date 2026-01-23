import { useAuthStore } from "@/lib/auth/authStore";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { hideModal } from "../../store";
import type { MembershipTier } from "@/lib/pricing";
import toast from "react-hot-toast";

interface UseUpgradeFlowProps {
  setIsLoading: (loading: boolean) => void;
  onSuccess?: (tier: MembershipTier) => void;
  onCancel?: () => void;
}

export function useUpgradeFlow({ setIsLoading, onSuccess: _onSuccess, onCancel: _onCancel }: UseUpgradeFlowProps) {
  const user = useAuthStore((state: any) => state.user);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade your account");
      return;
    }

    setIsLoading(true);
    try {
      // Close the current modal
      hideModal();

      // handleSubscribe will show the checkout modal
      await handleSubscribe({
        tier: "premium",
        userEmail: user.email,
        returnPath: window.location.pathname
      });

      // Note: The checkout modal is now triggered directly by handleSubscribe
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start checkout process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUpgrade };
}
