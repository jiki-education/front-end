"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmAccountDeletion } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiError } from "@/lib/api";
import { DeletingState, DeletedState, ErrorState, ExpiredLinkState } from "@/components/delete-account";

type Status = "deleting" | "success" | "expired" | "error";

export default function DeleteAccountConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const setNoUser = useAuthStore((state) => state.setNoUser);

  const [status, setStatus] = useState<Status>("deleting");
  const hasStartedDeletion = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("expired");
      return;
    }

    if (hasStartedDeletion.current) {
      return;
    }
    hasStartedDeletion.current = true;

    const doDeleteAccount = async () => {
      try {
        await confirmAccountDeletion(token);
        setNoUser(null);
        setStatus("success");
      } catch (error) {
        // 4xx errors indicate invalid/expired token
        // 5xx or network errors are server-side issues
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          setStatus("expired");
        } else {
          setStatus("error");
        }
      }
    };

    void doDeleteAccount();
  }, [token, setNoUser]);

  if (status === "deleting") {
    return <DeletingState />;
  }

  if (status === "success") {
    return <DeletedState />;
  }

  if (status === "expired") {
    return <ExpiredLinkState />;
  }

  return <ErrorState />;
}
