"use client";

import { useEffect, useState } from "react";
import { CheckInboxMessage } from "@/components/auth/CheckInboxMessage";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { AuthPanelProps } from "@/lib/content/getAuthPanelProps";

export default function CheckEmailClient({ panel }: { panel: AuthPanelProps }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEmail(localStorage.getItem("just_signed_up_email") ?? "");
    } catch {
      setEmail("");
    }
  }, []);

  if (email === null) {
    return null;
  }

  return (
    <AuthLayout {...panel}>
      <CheckInboxMessage email={email} />
    </AuthLayout>
  );
}
