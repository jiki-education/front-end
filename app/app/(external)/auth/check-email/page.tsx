"use client";

import { useEffect, useState } from "react";
import { CheckInboxMessage } from "@/components/auth/CheckInboxMessage";

export default function CheckEmailPage() {
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

  return <CheckInboxMessage email={email} />;
}
