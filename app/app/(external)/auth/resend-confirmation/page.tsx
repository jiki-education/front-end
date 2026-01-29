import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Resend Confirmation - Jiki",
  description: "Resend confirmation instructions"
};

export default function ResendConfirmationPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResendConfirmationForm />
      </Suspense>
    </AuthLayout>
  );
}
