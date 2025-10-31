import { ConfirmEmailForm } from "@/components/auth/ConfirmEmailForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Confirm Email - Jiki",
  description: "Confirm your email address"
};

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailForm />
    </Suspense>
  );
}