"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmAccountDeletion } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiError, getApiErrorType } from "@/lib/api";
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
  const [failure, setFailure] = useState<unknown>(null);
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
        // A 4xx is normally a bad or expired token, but `stripe_error` is a
        // failure to cancel the subscription, which is not an expired link and
        // must not be reported as one.
        const type = getApiErrorType(error);
        if (type === "stripe_error") {
          setFailure(error);
          setStatus("error");
        } else if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
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

  return <ErrorState error={failure} />;
}
