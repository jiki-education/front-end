"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmail as confirmEmailApi } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { ConfirmingEmailMessage } from "./ConfirmingEmailMessage";
import { EmailConfirmedMessage } from "./EmailConfirmedMessage";
import { LinkExpiredMessage } from "./LinkExpiredMessage";

export function ConfirmEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const doConfirmEmail = async () => {
      try {
        const user = await confirmEmailApi(token);
        setUser(user);
        setStatus("success");

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch {
        setStatus("error");
      }
    };

    void doConfirmEmail();
  }, [token, router, setUser]);

  if (status === "confirming") {
    return <ConfirmingEmailMessage />;
  }

  if (status === "success") {
    return <EmailConfirmedMessage />;
  }

  return <LinkExpiredMessage />;
}
