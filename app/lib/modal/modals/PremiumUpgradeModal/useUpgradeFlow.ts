import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { showModal, hideModal } from "../../store";
import type { MembershipTier } from "@/lib/pricing";
import toast from "react-hot-toast";

interface UseUpgradeFlowProps {
  setIsLoading: (loading: boolean) => void;
  onSuccess?: (tier: MembershipTier) => void;
  onCancel?: () => void;
}

export function useUpgradeFlow({ setIsLoading, onSuccess, onCancel }: UseUpgradeFlowProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const user = useAuthStore((state: any) => state.user);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade your account");
      return;
    }

    setIsLoading(true);
    try {
      await handleSubscribe({
        tier: "premium",
        userEmail: user.email,
        setSelectedTier,
        setClientSecret,
        returnPath: window.location.pathname
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start checkout process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clientSecret && selectedTier) {
      hideModal();
      setTimeout(() => {
        showModal("subscription-checkout-modal", {
          clientSecret,
          selectedTier,
          onCancel: () => onCancel?.(),
          onSuccess: () => onSuccess?.(selectedTier)
        });
      }, 100);
    }
  }, [clientSecret, selectedTier, onCancel, onSuccess]);

  return { handleUpgrade };
}
