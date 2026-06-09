"use client";

import { useEffect, useState } from "react";
import { CheckInboxMessage } from "@/components/auth/CheckInboxMessage";
import { AuthLayout } from "@/components/ui/AuthLayout";

export default function CheckEmailClient() {
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
    <AuthLayout>
      <CheckInboxMessage email={email} />
    </AuthLayout>
  );
}
