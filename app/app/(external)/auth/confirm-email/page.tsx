import { ConfirmEmailForm } from "@/components/auth/ConfirmEmailForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Confirm Email - Jiki",
  description: "Confirm your email address"
};

export default function ConfirmEmailPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ConfirmEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
