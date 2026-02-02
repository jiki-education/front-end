"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmAccountDeletion } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { DeletingAccountMessage } from "@/components/auth/DeletingAccountMessage";
import { AccountDeletedMessage } from "@/components/auth/AccountDeletedMessage";
import { DeletionLinkExpiredMessage } from "@/components/auth/DeletionLinkExpiredMessage";

export default function DeleteAccountConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const setNoUser = useAuthStore((state) => state.setNoUser);

  const [status, setStatus] = useState<"deleting" | "success" | "error">("deleting");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const doDeleteAccount = async () => {
      try {
        await confirmAccountDeletion(token);
        setNoUser(null);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    void doDeleteAccount();
  }, [token, setNoUser]);

  if (status === "deleting") {
    return <DeletingAccountMessage />;
  }

  if (status === "success") {
    return <AccountDeletedMessage />;
  }

  return <DeletionLinkExpiredMessage />;
}
