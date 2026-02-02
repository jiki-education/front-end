"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmAccountDeletion } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiError } from "@/lib/api";
import DeletingState from "./DeletingState";
import DeletedState from "./DeletedState";
import ErrorState from "./ErrorState";
import ExpiredLinkState from "./ExpiredLinkState";

type Status = "deleting" | "success" | "expired" | "error";

export default function DeleteAccountConfirmContent() {
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

    let isMounted = true;

    const doDeleteAccount = async () => {
      try {
        await confirmAccountDeletion(token);
        if (!isMounted) {
          return;
        }
        setNoUser(null);
        setStatus("success");
      } catch (error) {
        if (!isMounted) {
          return;
        }
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

    return () => {
      isMounted = false;
    };
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
